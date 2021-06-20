import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/UserResolver";
import { QueryLogger } from "./utils/QueryLogger";

(async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User],
    synchronize: true,
    logger: QueryLogger.create(),
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
})().catch(console.error);
