import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;
}
