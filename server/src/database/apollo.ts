import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DirectMessageResolver } from "../resolvers/DirectMessageResolver";
import { UserBanResolver } from "../resolvers/UserBanResolver";
import { UserResolver } from "../resolvers/UserResolver";

export default async () =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, UserBanResolver, DirectMessageResolver],
      validate: false,
      emitSchemaFile: true,
    }),
    context: (ctx) => ctx,
  });
