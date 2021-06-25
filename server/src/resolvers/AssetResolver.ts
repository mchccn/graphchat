import { SHA1 } from "crypto-js";
import { constants, createWriteStream } from "fs";
import { access, unlink } from "fs/promises";
import { GraphQLUpload } from "graphql-upload";
import { join } from "path";
import { User } from "src/entities/User";
import { Context, Upload } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { hex } from "src/utils/ids";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { QueryError } from "./errors/QueryError";
import CheckBans from "./guards/banned";

@ObjectType()
export class AvatarResponse {
  @Field(() => [QueryError], { nullable: true })
  errors?: QueryError[];

  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}

@Resolver()
export class AssetResolver {
  @Mutation(() => AvatarResponse)
  @UseMiddleware(CheckBans)
  async changeAvatar(
    @Arg("avatar", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Ctx() { req }: Context
  ): Promise<AvatarResponse> {
    try {
      const served = join(
        "assets",
        "avatars",
        `${SHA1(hex(16) + Date.now().toString()).toString()}.${
          filename.split(".").reverse()[0]
        }`
      );

      const path = join("public", served);

      const file = join(__dirname, "..", path);

      const success = await new Promise<boolean>((resolve, reject) =>
        createReadStream().pipe(
          createWriteStream(file)
            .on("finish", () => resolve(true))
            .on("error", reject)
        )
      );

      if (success) {
        const user = (await User.findOne(req.session.user))!;

        user.avatar = `${process.env.SERVER_ADDRESS}/${served}`;

        console.log(user.avatar);

        await user.save();
      } else if (
        await access(file, constants.F_OK)
          .then(() => true)
          .catch(() => false)
      )
        await unlink(file);

      return { success };
    } catch (e) {
      console.error(e);

      return wrapErrors(queryError(500, "internal server error"));
    }
  }
}
