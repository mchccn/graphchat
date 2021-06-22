import connect from "connect-redis";
import cookies from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import RedisClient from "ioredis";
import "reflect-metadata";
import { __milliseconds__, __prod__ } from "../constants";
import logger from "../utils/logging";
import root from "./routes/root";

const client = new RedisClient(
  parseInt(process.env.REDIS_PORT!),
  process.env.REDIS_HOST!
)
  .on("error", (e) => logger.error(`Redis error: ${e}`))
  .on("connect", () => logger.info("Connected to redis!"));

const app = express().use(
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
    store: new (connect(session))({ client }),
  }),
  express.json(),
  express.urlencoded({ extended: true }),
  cookies(),
  root
);

export default app;