import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  description?: string;
}
