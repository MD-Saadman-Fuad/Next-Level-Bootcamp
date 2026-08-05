import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { premiumController } from "./premium.controller";
import { Role, SubscriptionStatus } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGaurd } from "../../middlewares/premiumGaurd";


const router = Router();

router.get("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    subscriptionGaurd(),
premiumController.getPremiumContent);


export const premiumRoutes = router;