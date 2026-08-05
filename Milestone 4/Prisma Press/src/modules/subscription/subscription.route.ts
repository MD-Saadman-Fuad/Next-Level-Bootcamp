import express, { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.createCheckoutSession,
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  subscriptionController.handleWebhook,
);

//cancel subscription
router.post(
  "/cancel",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.cancelSubscription,
);

router.get(
  "/status",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.getSubscriptionStatus,
);
export const subscriptionRoutes = router;
