import { RequestHandler } from 'express';

const logger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

export default logger;
