import { ExpressContext } from "apollo-server-express";
import { Response } from "express";
import { Stream } from "stream";

export interface Context extends ExpressContext {
  req: ExpressContext["req"] & {
    session: ExpressContext["req"]["session"] & {
      user: string;
    };
  };
  res: Response;
}

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
