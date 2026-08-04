import Stripe from "stripe";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

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
      break;
    //Occurs whenever a customer’s subscription ends.
    case "customer.subscription.deleted":
      break;
    default:
      // Unexpected event type
      console.log(`No events Matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getPeriodEndDate = async (payload: Stripe.Subscription) => {
  // const currentPeriodStart = stripeSubscription.items.data[0]?.current_period_start;
  const currentPeriodEndInMilliseconds =
    payload.items.data[0]?.current_period_end;

  const currentPeriodEnd = new Date(currentPeriodEndInMilliseconds! * 1000);
  return currentPeriodEnd;
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
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

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
};
