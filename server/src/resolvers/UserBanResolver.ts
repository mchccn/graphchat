import { __milliseconds__ } from "src/constants";
import { User } from "src/entities/User";
import { UserBan } from "src/entities/UserBan";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { io } from "src/utils/users";
import { modlog } from "src/utils/webhooks";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { QueryError } from "./errors/QueryError";
import AdminPerms from "./guards/admin";
import CheckBans from "./guards/banned";
import { UserBanEditInput } from "./inputs/UserBanEditInput";

@ObjectType()
class UserBanResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => UserBan, { nullable: true })
  ban?: UserBan;
}

@ObjectType()
class UserBansResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [UserBan], { nullable: true })
  bans?: UserBan[];
}

@Resolver()
export class UserBanResolver {
  @Mutation(() => UserBanResponse)
  @UseMiddleware(CheckBans, AdminPerms)
  async ban(
    @Arg("id") id: string,
    @Arg("reason") reason: string,
    @Arg("length", { nullable: true }) length: number,
    @Ctx() { req }: Context
  ): Promise<UserBanResponse> {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const offender = (await User.findOne({ id }))!;

      if (!io(moderator).isHigherThan(offender))
        return wrapErrors(queryError(403, "forbidden"));

      if (!reason) return wrapErrors(queryError(400, "no reason provided"));

      if (length > __milliseconds__.NEVER)
        return wrapErrors(queryError(400, "ban length too long"));

      const ban = await UserBan.create({
        offender: offender.username,
        moderator: moderator.username,
        offenderId: offender.id,
        moderatorId: moderator.id,
        reason,
        expires: new Date(Date.now() + (length ?? __milliseconds__.NEVER)),
      }).save();

      await modlog({
        type: "ban",
        meta: ban,
        moderator,
        offender,
        reason,
      });

      return { ban };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserBanResponse)
  @UseMiddleware(CheckBans, AdminPerms)
  async editBan(
    @Arg("case") caseNumber: number,
    @Arg("data") { reason, expires }: UserBanEditInput,
    @Ctx() { req }: Context
  ): Promise<UserBanResponse> {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const ban = await UserBan.findOne({
        where: {
          case: caseNumber,
        },
      });

      if (!ban) return wrapErrors(queryError(400, "ban doesn't exist"));

      if (
        ban.moderatorId !== moderator.id ||
        ban.moderator !== moderator.username
      )
        return wrapErrors(queryError(403, "forbidden"));

      if (!reason) return wrapErrors(queryError(400, "no reason provided"));

      ban.reason = reason ?? ban.reason;
      ban.expires = expires ?? ban.expires;

      await ban.save();

      return { ban };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserBansResponse)
  @UseMiddleware(CheckBans, AdminPerms)
  async unban(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserBansResponse> {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const offender = (await User.findOne({ id }))!;

      if (!io(moderator).isHigherThan(offender))
        return wrapErrors(queryError(403, "forbidden"));

      const bans = await UserBan.find({
        where: {
          offender: offender.username,
          offenderId: offender.id,
        },
      });

      await Promise.allSettled(bans.map((ban) => UserBan.delete(ban)));

      return { bans };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => UserBansResponse)
  @UseMiddleware(CheckBans, AdminPerms)
  async fetchBans(@Arg("id") id: string) {
    try {
      const offender = (await User.findOne({ id }))!;

      const bans = await UserBan.find({
        where: {
          offender: offender.username,
          offenderId: offender.id,
        },
      });

      return { bans };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
