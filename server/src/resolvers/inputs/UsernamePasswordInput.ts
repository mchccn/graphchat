import { Field, InputType } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@InputType()
export class UsernamePasswordEmailInput {
  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field()
  email!: string;
}
