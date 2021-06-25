import { PubSub } from "apollo-server-express";
import { DirectMessage } from "src/entities/DirectMessage";
import { UserFriend } from "src/entities/UserFriend";
import { UserFriendRequest } from "src/entities/UserFriendRequest";
import { Resolver, Root, Subscription } from "type-graphql";

type Construct<Keys extends readonly string[]> = { [K in Keys[number]]: K };

class PublishSubscribe<
  Events extends { [event: string]: unknown } = Record<string, never>
> extends PubSub {
  publish<K extends keyof Events>(
    triggerName: K & string,
    payload: Events[K] extends never ? any : Events[K]
  ) {
    return super.publish(triggerName, payload);
  }
}

export const pubsub = new PublishSubscribe<{
  NEW_DM: DirectMessage;
  NEW_FRIEND: UserFriend;
  NEW_FRIEND_REQUEST: UserFriendRequest;
}>();

const events = ["NEW_DM", "NEW_FRIEND", "NEW_FRIEND_REQUEST"] as const;

const EVENTS = Object.fromEntries(events.map((e) => [e, e])) as Construct<typeof events>;

@Resolver()
export class EventsResolver {
  @Subscription(() => DirectMessage, { topics: [EVENTS.NEW_DM] })
  async newDM(@Root() payload: DirectMessage): Promise<DirectMessage> {
    return payload;
  }

  @Subscription(() => UserFriend, { topics: [EVENTS.NEW_FRIEND] })
  async newFriend(@Root() payload: UserFriend): Promise<UserFriend> {
    return payload;
  }

  @Subscription(() => UserFriendRequest, { topics: [EVENTS.NEW_FRIEND_REQUEST] })
  async newFriendRequest(@Root() payload: UserFriendRequest): Promise<UserFriendRequest> {
    return payload;
  }
}
