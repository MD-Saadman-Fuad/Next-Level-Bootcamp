import app from './app';
import config from './config';
import { initDB, pool } from './db';

async function bootstrap() {
  await initDB();

  if (!process.env.VERCEL) {
    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    const exitHandler = () => {
      server.close(() => console.log('Server closed.'));
      pool.end().then(() => process.exit(0));
    };

    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler);
  }
}

bootstrap().catch(console.error);

export default app;