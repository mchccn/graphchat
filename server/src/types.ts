import { ExpressContext } from "apollo-server-express";
import { Response } from "express";

export interface Context extends ExpressContext {
  req: ExpressContext["req"] & {
    session: ExpressContext["req"]["session"] & {
      user: string;
    };
  };
  res: Response;
}
