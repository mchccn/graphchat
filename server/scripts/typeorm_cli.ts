import { config as dotenv } from "dotenv";
import { join } from "path";
import prompts from "prompts";
import { createConnection } from "typeorm";
import { Article } from "../src/entities/Article";
import { ArticleComment } from "../src/entities/ArticleComment";
import { DirectMessage } from "../src/entities/DirectMessage";
import { Post } from "../src/entities/Post";
import { PostComment } from "../src/entities/PostComment";
import { User } from "../src/entities/User";
import { UserBan } from "../src/entities/UserBan";
import { UserBlock } from "../src/entities/UserBlock";
import { UserFollow } from "../src/entities/UserFollow";
import { UserFriend } from "../src/entities/UserFriend";
import { UserFriendRequest } from "../src/entities/UserFriendRequest";

dotenv({
  path: join(__dirname, "..", ".env"),
});

(async () => {
  const entities = [
    User,
    UserBan,
    UserBlock,
    UserFollow,
    UserFriend,
    UserFriendRequest,
    DirectMessage,
    Post,
    PostComment,
    Article,
    ArticleComment,
  ];

  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities,
    synchronize: true,
  });

  await orm.runMigrations({ transaction: "none" });

  const cmds = ["quit", "select"];

  const commands: Record<
    typeof cmds[number],
    (ctx: { args: string[] }) => unknown | Promise<unknown>
  > = {
    async select({ args }) {
      const [table, columns] = args;

      const entity = entities.find((ent) => ent.name === table);

      if (!entity) return `Entity ${table} does not exist.`;

      const query = orm.createQueryBuilder().select().from(entity, table);

      if (columns) query.select(columns.split(","));

      try {
        return query.execute();
      } catch (e) {
        return e.message;
      }
    },
    quit() {
      process.exit(0);
    },
  } as const;

  await (async function cli(): Promise<void> {
    const { command }: { command: string } = await prompts({
      type: "text",
      name: "command",
      message: ">",
      validate: (value) =>
        !value || cmds.includes(value.split(/\s+/)[0])
          ? true
          : "Unknown command.",
    });

    if (command && command.trim()) {
      const [cmd, ...args] = command.split(/\s+/);

      try {
        const output = await commands[cmd]?.({ args });

        if (output) console.log(output);
      } catch (e) {
        console.log(`${e.name}: ${e.message}`);
      }
    }

    return cli();
  })();
})();
