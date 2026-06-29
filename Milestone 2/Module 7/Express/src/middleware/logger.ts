import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import fs from "fs";
const logger = (req: Request, res: Response, next: NextFunction) => {
  // console.log(`${req.method} ${req.url}`);
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', err => {});
  next();
}

export default logger;