import { Router } from "express";
import { profilesController } from "./profiles.controller";

const router = Router();

router.post("/", profilesController.createProfile)


export const profileRoutes = router;