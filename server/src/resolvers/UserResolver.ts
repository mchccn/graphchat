import argon2 from "argon2";
import { User } from "src/entities/User";
import { Context } from "src/types";
import { queryError } from "src/utils/errors";
import { uuid } from "src/utils/ids";
import { io } from "src/utils/users";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { QueryError } from "./errors/QueryError";
import CheckBans from "./guards/banned";
import { UpdateUserInput } from "./inputs/UpdateUserInput";
import {
  UsernamePasswordEmailInput,
  UsernamePasswordInput,
} from "./inputs/UsernamePasswordInput";

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
  @UseMiddleware(CheckBans)
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
          errors: [queryError(409, "username is already taken")],
        };

      if (username.length <= 2) {
        return {
          errors: [queryError(400, "username length must be greater than 2")],
        };
      }

      if (password.length <= 2) {
        return {
          errors: [queryError(400, "password length must be greater than 2")],
        };
      }

      if (
        !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
          email
        )
      ) {
        return {
          errors: [queryError(400, "invalid email")],
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
        errors: [queryError(500, "internal server error")],
      };
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(CheckBans)
  async login(
    @Arg("input") { username, password }: UsernamePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({ where: { username } });

      if (!user)
        return {
          errors: [queryError(400, "username doesn't exist")],
        };

      if (!(await argon2.verify(user.password, password)))
        return {
          errors: [queryError(401, "incorrect password")],
        };

      req.session.user = user.id;

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [queryError(500, "internal server error")],
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
        errors: [queryError(500, "internal server error")],
      };
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(CheckBans)
  async updateUser(
    @Arg("data") data: UpdateUserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({ id: req.session.user });

      if (!user)
        return {
          errors: [queryError(400, "user doesn't exist")],
        };

      await User.update({ id: req.session.user }, data);

      await user.reload();

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [queryError(500, "internal server error")],
      };
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(CheckBans)
  async deleteUser(
    @Arg("id") id: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const moderator = (await User.findOne({ id: req.session.user }))!;

      const user = (await User.findOne({ id }))!;

      if (!user)
        return {
          errors: [queryError(400, "user doesn't exist")],
        };

      if (
        id !== req.session.user &&
        (!["sysadmin", "administrator", "moderator"].includes(moderator.role) ||
          !io(moderator).isHigherThan(user))
      )
        return {
          errors: [queryError(403, "forbidden")],
        };

      await User.delete(user);

      return { user };
    } catch (e) {
      console.error(e);

      return {
        errors: [queryError(500, "internal server error")],
      };
    }
  }
}
