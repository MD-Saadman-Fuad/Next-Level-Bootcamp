import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";


export const getPeriodEndDate = async (payload: Stripe.Subscription) => {
  // const currentPeriodStart = stripeSubscription.items.data[0]?.current_period_start;
  const currentPeriodEndInMilliseconds =
    payload.items.data[0]?.current_period_end;

  const currentPeriodEnd = new Date(currentPeriodEndInMilliseconds! * 1000);
  return currentPeriodEnd;
};

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  // console.log("Checkout session completed event received:", event.data.object);
  // const session: Stripe.Checkout.Session = event.data.object;
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("Missing required data in the webhook event");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId as string,
  );

  const currentPeriodEnd = await getPeriodEndDate(stripeSubscription);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriod: currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriod: currentPeriodEnd,
    },
  });
};

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
  const stripesubscriptionId = payload.id;
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;
  const currentPeriodEnd = getPeriodEndDate(payload);

  const isSubscriptionexist = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripesubscriptionId },
  });

  if (!isSubscriptionexist) {
    throw new Error("Subscription not found");
    console.log(
      "Subscription not found for stripeSubscriptionId:",
      stripesubscriptionId,
    );
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripesubscriptionId },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};

