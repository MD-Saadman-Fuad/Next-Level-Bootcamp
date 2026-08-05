import { NextFunction, Request, Response } from "express";
import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const subscriptionGaurd = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!subscription) {
      throw new Error(
        "You are not subscribed to the premium content. Please subscribe to access this content.",
      );
    }
    if (subscription?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        "Please subscribe again to the premium content to access this content.",
      );
    }

    next();
  });
};
