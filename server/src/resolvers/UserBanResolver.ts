import { User } from "src/entities/User";
import { UserBan } from "src/entities/UserBan";
import { Context } from "src/types";
import { queryError } from "src/utils/errors";
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
import CheckBans from "./guards/banned";

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
  @UseMiddleware(CheckBans)
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
        return {
          errors: [queryError(403, "forbidden")],
        };

      const ban = await UserBan.create({
        offender: offender.username,
        moderator: moderator.username,
        offenderId: offender.id,
        moderatorId: moderator.id,
        reason,
        expires: new Date(Date.now() + length),
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

      return {
        errors: [queryError(500, "internal server error")],
      };
    }
  }

  @Mutation(() => UserBansResponse)
  @UseMiddleware(CheckBans)
  async unban(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserBansResponse> {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const offender = (await User.findOne({ id }))!;

      if (!io(moderator).isHigherThan(offender))
        return {
          errors: [queryError(403, "forbidden")],
        };

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

      return {
        errors: [queryError(500, "internal server error")],
      };
    }
  }

  @Query(() => UserBansResponse)
  @UseMiddleware(CheckBans)
  async fetchBans(@Arg("id") id: string, @Ctx() { req }: Context) {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const offender = (await User.findOne({ id }))!;

      if (!["sysadmin", "administrator", "moderator"].includes(moderator.role))
        return {
          errors: [queryError(403, "forbidden")],
        };

      const bans = await UserBan.find({
        where: {
          offender: offender.username,
          offenderId: offender.id,
        },
      });

      return { bans };
    } catch (e) {
      console.error(e);

      return {
        errors: [queryError(500, "internal server error")],
      };
    }
  }
}
