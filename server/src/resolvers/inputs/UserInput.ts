import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  displayName!: string;
}
