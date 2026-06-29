import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import {Pool} from 'pg';
import config from "./config";
import {pool} from "./db";
import { userRoutes } from "./Modules/User/user.route";
import { profileRoutes } from "./Modules/Profiles/profiles.route";
import { authRoutes } from "./Modules/auth/auth.route";
import fs from "fs";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
;


const app: Application = express();
app.use(cookieParser());
// const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
// 
app.use(cors({
  origin: "http://localhost:5000", // Replace with your frontend URL
}));

app.use(logger);


app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Hello World!!! Express Server is running with TypeScript",
    "author": "PH Next Level",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/auth", authRoutes);


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


app.use(globalErrorHandler);


export default app;