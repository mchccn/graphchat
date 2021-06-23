import { config as dotenv } from "dotenv";
import { join } from "path";
import { createConnection } from "typeorm";

dotenv({
  path: join(__dirname, "..", ".env"),
});

(async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      url: process.env.DB_URL,
    });

    await connection.dropDatabase();

    await connection.close();

    console.log(`Database dropped.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
