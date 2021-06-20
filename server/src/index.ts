import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ReanvueResolver } from "./resolvers/reanvue";

const main = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ReanvueResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
};

main().catch((err) => {
  console.error(err);
});
