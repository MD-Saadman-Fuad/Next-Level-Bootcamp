import Stripe from "stripe";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customerId = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customerId.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    //Occurs when a Checkout Session has been successfully completed.
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);

      break;
    //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    case "customer.subscription.updated":
      await handleChangeSubscription(event.data.object);
      /*
       to test this run this command on the terminal 
       stripe subscription cancel <existing_subscription_id>
      */
      break;
    //Occurs whenever a customer’s subscription ends.
    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No events Matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const isActive =
    subscription.status === SubscriptionStatus.ACTIVE &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd > new Date();

  return {
    status: subscription.status,
    isSubscribed: isActive,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
};
 

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
};
