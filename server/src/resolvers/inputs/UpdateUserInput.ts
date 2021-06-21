import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  status?: string;
}
