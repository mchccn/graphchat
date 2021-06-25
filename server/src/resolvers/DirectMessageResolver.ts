import { DirectMessage } from "src/entities/DirectMessage";
import { User } from "src/entities/User";
import { UserBlock } from "src/entities/UserBlock";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { uuid } from "src/utils/ids";
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
import { pubsub } from "./EventsResolver";
import CheckBans from "./guards/banned";

@ObjectType()
export class DirectMessageResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => DirectMessage, { nullable: true })
  message?: DirectMessage;
}

@ObjectType()
export class DirectMessagesResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => [DirectMessage], { nullable: true })
  messages?: DirectMessage[];
}

@Resolver()
export class DirectMessageResolver {
  @Mutation(() => DirectMessageResponse)
  @UseMiddleware(CheckBans)
  async sendDM(
    @Arg("receiver") id: string,
    @Arg("message") content: string,
    @Ctx() { req }: Context
  ): Promise<DirectMessageResponse> {
    try {
      if (content.length > 2000) return wrapErrors(queryError(400, "content is too long"));

      const sender = (await User.findOne(req.session.user))!;

      const receiver = (await User.findOne(id))!;

      if (
        (
          await UserBlock.find({
            where: {
              userId: req.session.user,
              blockedId: id,
            },
          })
        ).length
      )
        return wrapErrors(queryError(400, "user is blocked"));

      if (
        (
          await UserBlock.find({
            where: {
              blockedId: req.session.user,
              userId: id,
            },
          })
        ).length
      )
        return wrapErrors(queryError(400, "user has blocked you"));

      const message = await DirectMessage.create({
        id: uuid(),
        sender,
        receiver,
        receiverId: id,
        senderId: req.session.user,
        content,
      }).save();

      await pubsub.publish("NEW_DM", message);

      return { message };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => DirectMessageResponse)
  @UseMiddleware(CheckBans)
  async editDM(
    @Arg("id") id: string,
    @Arg("content") content: string,
    @Ctx() { req }: Context
  ): Promise<DirectMessageResponse> {
    try {
      const sender = (await User.findOne(req.session.user))!;

      const message = await DirectMessage.findOne(id);

      if (!message) return wrapErrors(queryError(400, "message doesn't exist"));

      if (message.senderId !== sender.id) return wrapErrors(queryError(403, "forbidden"));

      const receiver = await User.findOne({ id: message.receiverId });

      if (receiver) {
        if (
          (
            await UserBlock.find({
              where: {
                userId: req.session.user,
                blockedId: id,
              },
            })
          ).length
        )
          return wrapErrors(queryError(400, "user is blocked"));

        if (
          (
            await UserBlock.find({
              where: {
                blockedId: req.session.user,
                userId: id,
              },
            })
          ).length
        )
          return wrapErrors(queryError(400, "user has blocked you"));
      }

      if (content.length > 2000) return wrapErrors(queryError(400, "content is too long"));

      message.content = content;

      await message.save();

      return { message };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Mutation(() => DirectMessageResponse)
  @UseMiddleware(CheckBans)
  async deleteDM(@Arg("id") id: string, @Ctx() { req }: Context): Promise<DirectMessageResponse> {
    try {
      const sender = (await User.findOne(req.session.user))!;

      const message = await DirectMessage.findOne(id);

      if (!message) return wrapErrors(queryError(400, "message doesn't exist"));

      if (message.senderId !== sender.id) return wrapErrors(queryError(403, "forbidden"));

      const receiver = await User.findOne({ id: message.receiverId });

      if (receiver) {
        if (
          (
            await UserBlock.find({
              where: {
                userId: req.session.user,
                blockedId: id,
              },
            })
          ).length
        )
          return wrapErrors(queryError(400, "user is blocked"));

        if (
          (
            await UserBlock.find({
              where: {
                blockedId: req.session.user,
                userId: id,
              },
            })
          ).length
        )
          return wrapErrors(queryError(400, "user has blocked you"));
      }

      await DirectMessage.delete(message);

      return { message };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }

  @Query(() => DirectMessagesResponse)
  @UseMiddleware(CheckBans)
  async getDMs(
    @Arg("sender") sender: string,
    @Arg("offset", { nullable: true }) offset: number,
    @Arg("limit", { nullable: true }) limit: number,
    @Ctx() { req }: Context
  ): Promise<DirectMessagesResponse> {
    try {
      if (!sender) return wrapErrors(queryError(400, "no sender provided"));

      const receiver = (await User.findOne(req.session.user))!;

      const messages = await DirectMessage.find({
        where: {
          receiverId: receiver.id,
          senderId: sender,
        },
        order: {
          createdAt: "ASC",
        },
        skip: offset ?? 0,
        take: limit ?? 10,
        relations: ["sender", "receiver"],
      });

      return { messages };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
