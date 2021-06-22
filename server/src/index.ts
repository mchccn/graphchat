import { ApolloServer } from "apollo-server-express";
import connect from "connect-redis";
import cookies from "cookie-parser";
import "dotenv/config";
import express from "express";
import session from "express-session";
import RedisClient from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { __milliseconds__, __prod__ } from "./constants";
import { DirectMessage } from "./entities/DirectMessage";
import { Post } from "./entities/Post";
import { PostComment } from "./entities/PostComment";
import { User } from "./entities/User";
import { UserBan } from "./entities/UserBan";
import { UserBlock } from "./entities/UserBlock";
import { DirectMessageResolver } from "./resolvers/DirectMessageResolver";
import { UserBanResolver } from "./resolvers/UserBanResolver";
import { UserResolver } from "./resolvers/UserResolver";
import root from "./routes/root";
import logger from "./utils/logging";

(async () => {
  const port = process.env.PORT ?? 4000;

  const client = new RedisClient(
    parseInt(process.env.REDIS_PORT!),
    process.env.REDIS_HOST!
  )
    .on("error", (e) => logger.error(`Redis error: ${e}`))
    .on("connect", () => logger.info("Connected to redis!"));

  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User, UserBan, UserBlock, DirectMessage, Post, PostComment],
    synchronize: true,
    logging: !__prod__,
  });

  await orm.runMigrations({ transaction: "none" });

  logger.info("Connected to database!");

  const app = express().use(
    session({
      name: "reanvue.qid",
      secret: process.env.COOKIE_SECRET!,
      cookie: {
        maxAge: __milliseconds__.YEAR,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      resave: false,
      saveUninitialized: false,
      store: new (connect(session))({ client }),
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookies(),
    root
  );

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
