import "dotenv/config";
import "reflect-metadata";
import { UserFriend } from "src/entities/UserFriend";
import { UserFriendRequest } from "src/entities/UserFriendRequest";
import { createConnection } from "typeorm";
import { __prod__ } from "../constants";
import { DirectMessage } from "../entities/DirectMessage";
import { User } from "../entities/User";
import { UserBan } from "../entities/UserBan";
import { UserBlock } from "../entities/UserBlock";
import logger from "../utils/logging";

export default async () => {
  const orm = await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User, UserBan, UserBlock, UserFriend, UserFriendRequest, DirectMessage],
    synchronize: true,
    logging: !__prod__,
  });

  await orm.runMigrations({ transaction: "none" });

  logger.info("Connected to database!");

  return orm;
};
