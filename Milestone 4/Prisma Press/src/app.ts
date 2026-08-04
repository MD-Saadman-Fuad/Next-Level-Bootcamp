import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/users/users.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/posts/posts.route";
import { commentRoutes } from "./modules/comments/comments.routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { stripe } from "./lib/stripe";
import { premiumRoutes } from "./modules/premium/premium.route";

const app: Application = express();
const endpointSecret = config.stripe_webhook_secret;
// app.post(
//   "/api/subscription/webhook",
//   express.raw({ type: "application/json" }),
//   async (request, response) => {
//     let event = request.body;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature']!;
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err: any) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.status(400).json(`Webhook Error: ${err.message}`);
//     }
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
//   },
// );

// Note: webhook raw middleware moved to the route definition to avoid
// having `express.json()` override the raw body. See subscription.route.ts


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Prisma Press!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/premium", premiumRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
