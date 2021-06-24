import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import "reflect-metadata";
import { __prod__ } from "src/constants";
import { AssetResolver } from "src/resolvers/AssetResolver";
import { PostCommentResolver } from "src/resolvers/PostCommentResolver";
import { PostResolver } from "src/resolvers/PostResolver";
import { UserBlockResolver } from "src/resolvers/UserBlockResolver";
import { UserFollowResolver } from "src/resolvers/UserFollowResolver";
import { UserFriendResolver } from "src/resolvers/UserFriendResolver";
import { buildSchema } from "type-graphql";
import { DirectMessageResolver } from "../resolvers/DirectMessageResolver";
import { UserBanResolver } from "../resolvers/UserBanResolver";
import { UserResolver } from "../resolvers/UserResolver";

export default async () =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        UserBanResolver,
        UserBlockResolver,
        UserFollowResolver,
        UserFriendResolver,
        DirectMessageResolver,
        PostResolver,
        PostCommentResolver,
        AssetResolver,
      ],
      validate: false,
      emitSchemaFile: true,
    }),
    context: (ctx) => ctx,
    uploads: false,
    playground: !__prod__,
  });
