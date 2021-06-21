import { ApolloServer } from "apollo-server-express";
import cookies from "cookie-parser";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./entities/User";
import { UserBan } from "./entities/UserBan";
import { UserResolver } from "./resolvers/UserResolver";
import root from "./routes/root";
import logger from "./utils/logging";
import { QueryLogger } from "./utils/QueryLogger";

(async () => {
  const port = process.env.PORT ?? 4000;

  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User, UserBan],
    synchronize: true,
    logging: !__prod__,
    logger: !__prod__ ? QueryLogger.create() : undefined,
  });

  await orm.runMigrations({ transaction: "none" });

  logger.info("Connected to database!");

  const app = express().use(
    express.json(),
    express.urlencoded({ extended: true }),
    cookies(),
    root
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: (ctx) => ctx,
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => logger.success(`Server listening on port ${port}!`));
})().catch(console.error);
