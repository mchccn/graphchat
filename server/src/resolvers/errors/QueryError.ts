import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class QueryError {
  @Field(() => Number)
  status!: number;

  @Field(() => String)
  message!: string;
}
