import { config as dotenv } from "dotenv";
import { join } from "path";
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

const table = process.argv.slice(2)[0];

(async () => {
  try {
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

    const connection = await createConnection({
      type: "postgres",
      url: process.env.DB_URL,
      entities,
    });

    const entity = entities.find((ent) => ent.name === table);

    if (!entity && table) return console.log(`Entity does not exist.`);

    if (entity && table) {
      await connection
        .createQueryRunner()
        .dropTable(connection.getRepository(entity).metadata.tableName);

      console.log(`Table dropped`);
    } else {
      await connection.dropDatabase();

      console.log(`Database dropped.`);
    }

    await connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
