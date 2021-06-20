import fs from "fs/promises";
import path from "path";
import { FileLogger } from "typeorm";

export class QueryLogger extends FileLogger {
  constructor() {
    super("all", {
      logPath: `./server/logs/${Date.now()}.log`,
    });
  }

  static create() {
    fs.writeFile(
      path.join(__dirname, "..", "..", "logs", `${Date.now()}.log`),
      "",
      "utf8"
    );

    return new QueryLogger();
  }
}
