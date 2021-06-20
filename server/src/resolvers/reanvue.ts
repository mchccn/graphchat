import { Resolver, Query } from "type-graphql";

@Resolver()
export class ReanvueResolver {
  @Query(() => String)
  reanvue() {
    return "Reanvue";
  }
}
