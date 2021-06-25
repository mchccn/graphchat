import { Resolver, Subscription } from "type-graphql";

@Resolver()
export class EventsResolver {
  @Subscription({
    topics: [""],
  })
  async newDM() {}
}
