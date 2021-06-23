import { RedisStore } from "connect-redis";
import cookie from "cookie";
import parser from "cookie-parser";
import { Application, Request } from "express";
import { createServer } from "http";
import logger from "src/utils/logging";
import { Server } from "ws";

export default (app: Application, store: RedisStore) => {
  const server = createServer(app);

  const wss = new Server({ server });

  wss.on("listening", () => logger.success("Websockets server is running!"));

  wss.on("connection", (ws, req) => {
    console.log("CONNECTION");

    if (!req.headers.cookie) return ws.terminate();

    const cookies = cookie.parse(req.headers.cookie);

    const sid = parser.signedCookie(
      cookies["connect.sid"],
      process.env.COOKIE_SECRET!
    );

    if (!sid) return ws.terminate();

    store.get(sid, function (err, ss) {
      if (err) {
        console.error(err);

        return ws.terminate();
      }

      if (!ss) return ws.terminate();

      store.createSession(req as Request, ss);

      //@ts-ignore
      console.log(req.session);

      ws.on("message", (message) => {
        console.log(message);
      });
    });
  });

  return { wss, server };
};
