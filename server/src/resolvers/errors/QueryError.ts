import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class QueryError {
  @Field(() => Int)
  status!: number;

  @Field(() => String)
  message!: string;
}
