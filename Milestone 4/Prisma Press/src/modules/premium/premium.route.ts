import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { premiumController } from "./premium.controller";
import { Role } from "../../../generated/prisma/client";


const router = Router();

router.get("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR), premiumController.getPremiumContent);


export const premiumRoutes = router;