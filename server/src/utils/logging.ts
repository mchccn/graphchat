import Logger from "@aeroware/logger";
import fs from "fs";
import path from "path";
import { __prod__ } from "src/constants";

const logger = new Logger("Reanvue", !__prod__);

if (__prod__) {
  const err = fs.createWriteStream(
    path.join(__dirname, "..", "..", "logs", `${Date.now()}.error.log`),
    {
      flags: "a",
    }
  );

  const out = fs.createWriteStream(
    path.join(__dirname, "..", "..", "logs", `${Date.now()}.out.log`),
    {
      flags: "a",
    }
  );

  process.stdout.write = out.write.bind(out) as typeof process.stdout.write;
  process.stderr.write = err.write.bind(err) as typeof process.stderr.write;
}

export default logger;
