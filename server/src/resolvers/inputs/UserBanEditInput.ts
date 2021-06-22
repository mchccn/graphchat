import { Field, InputType } from "type-graphql";

@InputType()
export class UserBanEditInput {
  @Field(() => String)
  reason?: string;

  @Field(() => Date)
  expires?: Date;
}
