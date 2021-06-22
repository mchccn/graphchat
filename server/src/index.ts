import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import app from "./app";
import connect from "./database";
import { DirectMessageResolver } from "./resolvers/DirectMessageResolver";
import { UserBanResolver } from "./resolvers/UserBanResolver";
import { UserResolver } from "./resolvers/UserResolver";
import logger from "./utils/logging";

(async () => {
  const port = process.env.PORT ?? 4000;

  const orm = await connect();

  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, UserBanResolver, DirectMessageResolver],
      validate: false,
      emitSchemaFile: true,
    }),
    context: (ctx) => ctx,
  });

  apollo.applyMiddleware({ app });

  app.listen(port, () => logger.success(`Server listening on port ${port}!`));
})().catch(console.error);
