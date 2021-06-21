import argon2 from "argon2";
import { User } from "src/entities/User";
import { Context } from "src/types";
import { uuid } from "src/utils/ids";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { UpdateUserInput } from "./inputs/UpdateUserInput";
import {
  UsernamePasswordEmailInput,
  UsernamePasswordInput,
} from "./inputs/UsernamePasswordInput";
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context) {
    if (!req.session.user) return null;

    const user = await User.findOne({ id: req.session.user });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") { username, password, email }: UsernamePasswordEmailInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      if (await User.findOne({ where: { username } }))
        return {
          errors: [
            {
              status: 409,
              message: "username is already taken",
            },
          ],
        };

      if (username.length <= 2) {
        return {
          errors: [
            {
              status: 400,
              message: "username length must be greater than 2",
            },
          ],
        };
      }

      if (password.length <= 2) {
        return {
          errors: [
            {
              status: 400,
              message: "password length must be greater than 2",
            },
          ],
        };
      }

      const hashed = await argon2.hash(password);

      const user = await User.create({
        id: uuid(),
        username,
        password: hashed,
        displayName: username,
        avatar: "some-cool-avatar-url",
        email,
      }).save();

      req.session.user = user.id;

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [
          {
            status: 500,
            message: "internal server error",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") { username, password }: UsernamePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({ where: { username } });

      if (!user)
        return {
          errors: [
            {
              status: 400,
              message: "username doesn't exist",
            },
          ],
        };

      if (!(await argon2.verify(user.password, password)))
        return {
          errors: [
            {
              status: 401,
              message: "incorrect password",
            },
          ],
        };

      req.session.user = user.id;

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [
          {
            status: 500,
            message: "internal server error",
          },
        ],
      };
    }
  }

  @Query(() => UserResponse)
  async user(@Arg("id") id: string): Promise<UserResponse> {
    try {
      const user = await User.findOne({ id });

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [
          {
            status: 500,
            message: "internal server error",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updateUser(
    @Arg("data") data: UpdateUserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      if (!req.session.user)
        return {
          errors: [
            {
              status: 401,
              message: "unauthorized",
            },
          ],
        };

      const user = await User.findOne({ id: req.session.user });

      if (!user)
        return {
          errors: [
            {
              status: 400,
              message: "user doesn't exist",
            },
          ],
        };

      await User.update({ id: req.session.user }, data);

      await user.reload();

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [
          {
            status: 500,
            message: "internal server error",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async deleteUser(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      if (!req.session.user)
        return {
          errors: [
            {
              status: 401,
              message: "unauthorized",
            },
          ],
        };

      const moderator = await User.findOne({ id: req.session.user });

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

      const roles = [
        "sysadmin",
        "administrator",
        "moderator",
        "veteran",
        "user",
      ];

      if (
        (id !== req.session.user &&
          !["sysadmin", "administrator", "moderator"].includes(
            moderator!.role
          )) ||
        roles[roles.indexOf(moderator!.role)] <= roles[roles.indexOf(user.role)]
      )
        return {
          errors: [
            {
              status: 403,
              message: "forbidden",
            },
          ],
        };

      await User.delete({ id });

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [
          {
            status: 500,
            message: "internal server error",
          },
        ],
      };
    }
  }
}
