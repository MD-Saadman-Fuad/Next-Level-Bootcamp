import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    // const result = await subscriptionService.handleWebhook(event, signature);
    await subscriptionService.handleWebhook(
      event as Buffer,
      signature as string,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Webhook handled successfully",
      data: null,
    });
  },
);

const getSubscriptionStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionService.getSubscriptionStatus(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Subscription status retrieved successfully",
      data: result,
    });
  },
);

const cancelSubscription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionService.cancelSubscription(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Subscription canceled successfully",
      data: result,
    });
  },
);

export const subscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
};
