import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/users/users.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/posts/posts.route";
import { commentRoutes } from "./modules/comments/comments.routes";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.get("/", async (req: Request, res: Response) => {
    res.send("Welcome to Prisma Press!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;