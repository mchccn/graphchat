import { RedisStore } from "connect-redis";
import cookie from "cookie";
import parser from "cookie-parser";
import { Application } from "express";
import { createServer } from "http";
import { Context } from "src/types";
import logger from "src/utils/logging";
import { Server } from "ws";

export default (app: Application, store: RedisStore) => {
  const server = createServer(app);

  const wss = new Server({ server });

  wss.on("listening", () => logger.success("Websockets server is running!"));

  wss.on("connection", async (ws, req: Context["req"]) => {
    try {
      if (!req.headers.cookie) return ws.terminate();

      const cookies = cookie.parse(req.headers.cookie);

      const sid = parser.signedCookie(
        cookies["reanvue.qid"],
        process.env.COOKIE_SECRET!
      );

      if (!sid) return ws.terminate();

      await new Promise((resolve, reject) =>
        store.get(sid, (err, session) => {
          if (err) {
            ws.terminate();

            return reject(err);
          }

          if (!session) return ws.terminate();

          return resolve(store.createSession(req, session));
        })
      );

      ws.on("message", (message) => {
        console.log(message);
      });

      return;
    } catch (err) {
      console.error(err);

      return ws.terminate();
    }
  });

  return { wss, server };
};
