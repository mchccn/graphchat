import { RedisStore } from "connect-redis";
import cookie from "cookie";
import parser from "cookie-parser";
import { Application, Request } from "express";
import { createServer } from "http";
import { Server } from "ws";

export default (app: Application, store: RedisStore) => {
  const server = createServer(app);

  const wss = new Server({ server });

  wss.on("connection", (ws, req) => {
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

      ws.on("message", function incoming(message) {
        console.log("received: %s", message);
      });
    });
  });

  return wss;
};
