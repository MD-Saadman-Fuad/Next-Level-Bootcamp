import config from "./config";
import app from "./app";
import { initDB } from "./db";

const main = async () => {
  await initDB();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

main();
