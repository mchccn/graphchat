import { ExpressContext } from "apollo-server-express";

export interface Context extends ExpressContext {
  req: ExpressContext["req"] & {
    session: ExpressContext["req"]["session"] & {
      user: string;
    };
  };
}
