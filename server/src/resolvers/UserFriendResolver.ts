import { User } from "src/entities/User";
import { UserFriend } from "src/entities/UserFriend";
import { UserFriendRequest } from "src/entities/UserFriendRequest";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { QueryError } from "./errors/QueryError";
import CheckBans from "./guards/banned";

@ObjectType()
export class UserFriendResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => UserFriend, { nullable: true })
  friend?: UserFriend;
}

@ObjectType()
export class UserFriendsResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [UserFriend], { nullable: true })
  friends?: UserFriend[];
}

@ObjectType()
export class UserFriendRequestResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => UserFriendRequest, { nullable: true })
  request?: UserFriendRequest;
}

@ObjectType()
export class UserFriendRequestsResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [UserFriendRequest], { nullable: true })
  requests?: UserFriendRequest[];
}

@Resolver()
export class UserFriendResolver {
  @Mutation(() => UserFriendRequestResponse)
  @UseMiddleware(CheckBans)
  async addFriend(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserFriendRequestResponse> {
    try {
      const friend = await User.findOne(id);

      if (!friend) return wrapErrors(queryError(400, "user doesn't exist"));

      if (
        await UserFriendRequest.findOne({
          where: {
            userId: req.session.user,
            friendId: id,
          },
        })
      )
        return wrapErrors(queryError(405, "outgoing friend request"));

      const request = await UserFriendRequest.create({
        user: await User.findOne(req.session.user),
        friend,
        userId: req.session.user,
        friendId: id,
      }).save();

      return { request };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserFriendResponse)
  @UseMiddleware(CheckBans)
  async acceptFriend(
    @Arg("id") id: number,
    @Ctx() { req }: Context
  ): Promise<UserFriendResponse> {
    try {
      const request = await UserFriendRequest.findOne({ id });

      if (!request)
        return wrapErrors(queryError(400, "friend request doesn't exist"));

      if (req.session.user !== request.friendId)
        return wrapErrors(queryError(403, "forbidden"));

      const user = await User.findOne(req.session.user);

      const friended = await User.findOne(request.friendId);

      const friend = await UserFriend.create({
        user,
        friended,
        userId: req.session.user,
        friendedId: request.friendId,
      }).save();

      /* mutual relationship */
      await UserFriend.create({
        user: friended,
        friended: user,
        userId: request.friendId,
        friendedId: req.session.user,
      }).save();

      await UserFriendRequest.delete(request);

      return { friend };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserFriendRequestResponse)
  @UseMiddleware(CheckBans)
  async ignoreFriend(
    @Arg("id") id: number,
    @Ctx() { req }: Context
  ): Promise<UserFriendRequestResponse> {
    try {
      const request = await UserFriendRequest.findOne({ id });

      if (!request)
        return wrapErrors(queryError(400, "friend request doesn't exist"));

      if (req.session.user !== request.friendId)
        return wrapErrors(queryError(403, "forbidden"));

      await UserFriendRequest.delete(request);

      return { request };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserFriendResponse)
  @UseMiddleware(CheckBans)
  async removeFriend(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserFriendResponse> {
    try {
      const friend = await UserFriend.findOne({
        where: {
          userId: req.session.user,
          friendedId: id,
        },
      });

      const mutual = await UserFriend.findOne({
        where: {
          userId: id,
          friendedId: req.session.user,
        },
      });

      if (!friend) {
        if (mutual) await UserFriend.delete(mutual);

        return wrapErrors(queryError(405, "user is not friended"));
      }

      await UserFriend.delete(friend);

      if (mutual) await UserFriend.delete(mutual);

      return { friend };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => UserFriendsResponse)
  @UseMiddleware(CheckBans)
  async fetchFriends(@Ctx() { req }: Context): Promise<UserFriendsResponse> {
    try {
      const friends = await UserFriend.find({
        where: {
          userId: req.session.user,
        },
      });

      return { friends };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
