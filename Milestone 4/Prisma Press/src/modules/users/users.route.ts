import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { config } from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middlewares/auth";

const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

router.post("/register", userController.registerUser)

router.get("/me", auth(Role.ADMIN, Role.USER), userController.getMyProfile);

router.put("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updateMyProfile);



export const userRoutes = router;