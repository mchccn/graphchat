import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import connectDatabase from "./database";
import connectApollo from "./database/apollo";
import logger from "./utils/logging";

(async () => {
  const port = process.env.PORT ?? 4000;

  const orm = await connectDatabase();

  const apollo = await connectApollo();

  apollo.applyMiddleware({ app });

  app.listen(port, () => logger.success(`Server listening on port ${port}!`));
})().catch(console.error);
