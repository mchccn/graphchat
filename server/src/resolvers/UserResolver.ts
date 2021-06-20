import { User } from "src/entities/User";
import { uuid } from "src/utils/ids";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { UpdateUserInput } from "./inputs/UpdateUserInput";
import { UserInput } from "./inputs/UserInput";

@ObjectType()
class QueryError {
  @Field(() => Number)
  status!: number;

  @Field(() => String)
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async createUser(@Arg("data") data: UserInput): Promise<UserResponse> {
    const id = uuid();

    const user = await User.create({ id, ...data }).save();

    return { user };
  }

  @Query(() => UserResponse)
  async readUser(@Arg("id") id: string): Promise<UserResponse> {
    const user = await User.findOne({ id });

    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updateUser(
    @Arg("id") id: string,
    @Arg("data") data: UpdateUserInput
  ): Promise<UserResponse> {
    const user = await User.findOne({ id });

    if (!user)
      return {
        errors: [
          {
            status: 400,
            message: "user doesn't exist",
          },
        ],
      };

    await User.update({ id }, data);

    return { user };
  }

  @Mutation(() => UserResponse)
  async deleteUser(@Arg("id") id: string): Promise<UserResponse> {
    const user = await User.findOne({ id });

    if (!user)
      return {
        errors: [
          {
            status: 400,
            message: "user doesn't exist",
          },
        ],
      };

    await User.delete({ id });

    return { user };
  }
}
