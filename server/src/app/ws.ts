import { RedisStore } from "connect-redis";
import cookie from "cookie";
import parser from "cookie-parser";
import { Application } from "express";
import { createServer } from "http";
import { Context } from "src/types";
import logger from "src/utils/logging";
import WebSocket, { Server } from "ws";

export const sockets = new Map<string, WebSocket[]>();

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

      let buffer = "";

      ws.on("open", () => {
        if (sockets.get(req.session.user))
          sockets.get(req.session.user)!.push(ws);
        else sockets.set(req.session.user, [ws]);
      });

      ws.on("message", (message) => {
        const raw = message.toString("utf8");

        buffer += raw;

        try {
          const data = JSON.parse(raw);

          console.log(data);

          buffer = "";
        } catch {}
      });

      return ws.on("close", () => {
        const websockets = sockets.get(req.session.user);

        if (websockets) {
          const filtered = websockets.filter((websocket) => websocket !== ws);

          if (!filtered.length) sockets.delete(req.session.user);
          else sockets.set(req.session.user, filtered);
        }
      });
    } catch (err) {
      console.error(err);

      return ws.terminate();
    }
  });

  return { wss, server };
};
