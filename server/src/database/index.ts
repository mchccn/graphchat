import "dotenv/config";
import "reflect-metadata";
import { Article } from "src/entities/Article";
import { ArticleComment } from "src/entities/ArticleComment";
import { UserFollow } from "src/entities/UserFollow";
import { UserFriend } from "src/entities/UserFriend";
import { UserFriendRequest } from "src/entities/UserFriendRequest";
import { createConnection } from "typeorm";
import { __prod__ } from "../constants";
import { DirectMessage } from "../entities/DirectMessage";
import { Post } from "../entities/Post";
import { PostComment } from "../entities/PostComment";
import { User } from "../entities/User";
import { UserBan } from "../entities/UserBan";
import { UserBlock } from "../entities/UserBlock";
import logger from "../utils/logging";

export default async () => {
  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [
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
    ],
    synchronize: true,
    logging: !__prod__,
  });

  await orm.runMigrations({ transaction: "none" });

  logger.info("Connected to database!");

  return orm;
};
