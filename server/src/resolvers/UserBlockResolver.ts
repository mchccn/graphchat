import { User } from "src/entities/User";
import { UserBlock } from "src/entities/UserBlock";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
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
export class UserBlockResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => UserBlock, { nullable: true })
  block?: UserBlock;
}

@ObjectType()
export class UserBlocksResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [UserBlock], { nullable: true })
  blocks?: UserBlock[];
}

@Resolver()
export class UserBlockResolver {
  @Mutation(() => UserBlockResponse)
  @UseMiddleware(CheckBans)
  async block(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserBlockResponse> {
    try {
      const user = (await User.findOne({ id: req.session.user }))!;

      const blocked = await User.findOne({ id });

      if (!blocked) return wrapErrors(queryError(400, "user doesn't exist"));

      if (
        await UserBlock.findOne({
          where: {
            userId: req.session.user,
            blockedId: id,
          },
        })
      )
        return wrapErrors(queryError(405, "user is already blocked"));

      const block = await UserBlock.create({
        blocked,
        blockedId: blocked.id,
        user,
        userId: user.id,
      }).save();

      return { block };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserBlocksResponse)
  @UseMiddleware(CheckBans)
  async unblock(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserBlocksResponse> {
    try {
      const blocked = await User.findOne({ id });

      if (!blocked) return wrapErrors(queryError(400, "user doesn't exist"));

      const blocks = await UserBlock.find({
        where: {
          userId: req.session.user,
          blockedId: id,
        },
      });

      if (!blocks.length)
        return wrapErrors(queryError(405, "user is already unblocked"));

      await Promise.allSettled(blocks.map((block) => UserBlock.delete(block)));

      return { blocks };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => UserBlocksResponse)
  @UseMiddleware(CheckBans)
  async fetchBlocks(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserBlocksResponse> {
    try {
      const blocks = await UserBlock.find({
        where: {
          userId: req.session.user,
          blockedId: id,
        },
      });

      return { blocks };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
