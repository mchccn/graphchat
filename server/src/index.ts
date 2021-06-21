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
import { User } from "./entities/User";
import { UserBan } from "./entities/UserBan";
import { UserResolver } from "./resolvers/UserResolver";
import root from "./routes/root";
import logger from "./utils/logging";

(async () => {
  const port = process.env.PORT ?? 4000;

  const RedisStore = connect(session);

  const client = new RedisClient(
    parseInt(process.env.REDIS_PORT!),
    process.env.REDIS_HOST!
  );

  client.on("error", (e) => logger.error(`Redis error: ${e}`));

  client.on("connect", () => logger.info("Connected to redis!"));

  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User, UserBan],
    synchronize: true,
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
      store: new RedisStore({ client, disableTouch: true }),
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookies(),
    root
  );

  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: (ctx) => ctx,
  });

  apollo.applyMiddleware({ app });

  app.listen(port, () => logger.success(`Server listening on port ${port}!`));
})().catch(console.error);
