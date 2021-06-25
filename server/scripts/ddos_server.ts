import { exec, fork } from "child_process";
import { config as dotenv } from "dotenv";
import { join } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const { threads, requests, seconds, command } = yargs(hideBin(process.argv))
  .help()
  .option("threads", {
    alias: "t",
    type: "number",
    description: "number of threads to spawn",
    default: 1,
  })
  .option("requests", {
    alias: "r",
    type: "number",
    description: "number of requests per second",
    default: 100,
  })
  .option("seconds", {
    alias: "s",
    type: "number",
    description: "number of seconds to ddos",
    default: 1,
  })
  .option("command", {
    alias: "c",
    type: "string",
    description: "command to execute",
    default: `curl -X POST ${process.env.SERVER_ADDRESS}/graphql --data '{ "query": "{ me { id } }" }' -H "Content-Type: application/json"`,
  }).argv as unknown as {
  threads: number;
  requests: number;
  seconds: number;
  command: string;
};

dotenv({
  path: join(__dirname, "..", ".env"),
});

if (process.send) {
  let count = 0;

  let interval = setInterval(() => {
    count++;

    exec(command);

    if (count >= requests * seconds) return clearInterval(interval);
  }, seconds / requests);
} else {
  console.log(`DDOS-ing server at ${process.env.SERVER_ADDRESS}!`);

  (async () => {
    await Promise.all(
      new Array(threads)
        .fill("")
        .map(
          () => new Promise((resolve) => fork(__filename).on("exit", resolve))
        )
    );

    console.log(`Finished DDOS-ing the server!`);
  })();
}
