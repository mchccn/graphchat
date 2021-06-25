import { PubSub } from "apollo-server-express";
import { DirectMessage } from "src/entities/DirectMessage";
import { Resolver, Subscription } from "type-graphql";

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

const pubsub = new PublishSubscribe<{
  NEW_DM: DirectMessage;
}>();

const events = ["NEW_DM"] as const;

const EVENTS = Object.fromEntries(events.map((e) => [e, e])) as Construct<typeof events>;

@Resolver()
export class EventsResolver {
  @Subscription({ topics: [EVENTS.NEW_DM] })
  async newDM() {}
}
