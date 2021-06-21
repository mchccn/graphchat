import fs from "fs/promises";
import path from "path";
import { FileLogger } from "typeorm";

export class QueryLogger extends FileLogger {
  constructor() {
    super("all", {
      logPath: `./server/logs/query.log`,
    });
  }

  static create() {
    fs.writeFile(
      path.join(__dirname, "..", "..", "logs", `query.log`),
      "",
      "utf8"
    );

    return new QueryLogger();
  }
}
