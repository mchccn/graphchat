import connect from "connect-redis";
import cookies from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import { graphqlUploadExpress } from "graphql-upload";
import RedisClient from "ioredis";
import morgan from "morgan";
import { join } from "path";
import "reflect-metadata";
import { __milliseconds__, __prod__ } from "../constants";
import logger from "../utils/logging";
import root from "./routes/root";
import ws from "./ws";

const client = new RedisClient(
  parseInt(process.env.REDIS_PORT!),
  process.env.REDIS_HOST!
)
  .on("error", (e) => logger.error(`Redis error: ${e}`))
  .on("connect", () => logger.info("Connected to redis!"));

const store = new (connect(session))({ client });

const app = express()
  .use(
    morgan("dev"),
    cors({
      origin: process.env.CLIENT_ADDRESS,
      credentials: true,
    }),
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
      store,
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookies(),
    express.static(join(__dirname, "..", "public")),
    root
  )
  .use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 })
  );

const { wss, server } = ws(app, store);

export { wss, server };

export default app;
