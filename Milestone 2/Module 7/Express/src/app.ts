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


const app: Application = express();
// const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Hello World!!! Express Server is running with TypeScript",
    "author": "PH Next Level",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


export default app;