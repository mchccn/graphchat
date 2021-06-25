import { User } from "src/entities/User";
import { UserFollow } from "src/entities/UserFollow";
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
import { Context } from "vm";
import { QueryError } from "./errors/QueryError";
import CheckBans from "./guards/banned";
import { UsersResponse } from "./UserResolver";

@ObjectType()
export class UserFollowResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => UserFollow, { nullable: true })
  follow?: UserFollow;
}

@ObjectType()
export class UserFollowsResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [UserFollow], { nullable: true })
  follows?: UserFollow[];
}

@Resolver()
export class UserFollowResolver {
  @Mutation(() => UserFollowResponse)
  @UseMiddleware(CheckBans)
  async follow(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserFollowResponse> {
    try {
      const followed = await UserFollow.findOne({
        where: {
          userId: req.session.user,
          followedId: id,
        },
      });

      if (followed)
        return wrapErrors(queryError(405, "already following this user"));

      const follow = await UserFollow.create({
        user: await User.findOne(req.session.user),
        followed,
        userId: req.session.user,
        followedId: id,
      }).save();

      return { follow };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserFollowResponse)
  @UseMiddleware(CheckBans)
  async unfollow(@Arg("id") id: string, @Ctx() { req }: Context) {
    try {
      const follow = await UserFollow.findOne({
        where: {
          userId: req.session.user,
          followedId: id,
        },
      });

      if (!follow)
        return wrapErrors(queryError(405, "already not following this user"));

      await UserFollow.delete(follow);

      return { follow };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => UsersResponse)
  @UseMiddleware(CheckBans)
  async fetchFollowed(@Ctx() { req }: Context) {
    try {
      const followed = await UserFollow.find({
        where: {
          userId: req.session.user,
        },
        relations: ["user"],
      });

      const users = followed.map(({ followed }) => followed);

      return { users };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => UsersResponse)
  @UseMiddleware(CheckBans)
  async fetchFollowers(@Ctx() { req }: Context) {
    try {
      const followers = await UserFollow.find({
        where: {
          followedId: req.session.user,
        },
        relations: ["user"],
      });

      const users = followers.map(({ user }) => user);

      return { users };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
