// TKD Top Trumps — Stripe Webhook Handler
// Handles checkout.session.completed to record purchases

import express, { Express } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { purchases } from "../drizzle/schema";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (!webhookSecret || !sig) {
          console.warn("[Webhook] Missing secret or signature — skipping verification");
          event = JSON.parse(req.body.toString()) as Stripe.Event;
        } else {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).send("Webhook signature verification failed");
        return;
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id
          ? parseInt(session.metadata.user_id, 10)
          : null;
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        if (!paymentIntentId) {
          console.warn("[Webhook] No payment intent ID found in session");
          res.json({ received: true });
          return;
        }

        const db = await getDb();
        if (!db) {
          console.error("[Webhook] Database unavailable");
          res.status(500).json({ error: "Database unavailable" });
          return;
        }

        // If we have a userId, record the purchase and grant access
        if (userId) {
          try {
            await db.insert(purchases).values({
              userId,
              stripePaymentIntentId: paymentIntentId,
              stripeSessionId: session.id,
              amountPence: session.amount_total ?? 299,
              currency: session.currency ?? "gbp",
            }).onDuplicateKeyUpdate({ set: { stripeSessionId: session.id } });
            // Grant access on the user record
            await db.update(users)
              .set({ hasAccess: true, accessGrantedBy: "purchase" })
              .where(eq(users.id, userId));
            console.log(`[Webhook] Purchase recorded + access granted for user ${userId}`);
          } catch (err) {
            console.error("[Webhook] Failed to record purchase:", err);
          }
        } else {
          // Guest checkout — try to find user by email
          const email = session.customer_details?.email ?? session.metadata?.customer_email;
          if (email) {
            const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
            if (userResult[0]) {
              await db.insert(purchases).values({
                userId: userResult[0].id,
                stripePaymentIntentId: paymentIntentId,
                stripeSessionId: session.id,
                amountPence: session.amount_total ?? 299,
                currency: session.currency ?? "gbp",
              }).onDuplicateKeyUpdate({ set: { stripeSessionId: session.id } });
              // Grant access on the user record
              await db.update(users)
                .set({ hasAccess: true, accessGrantedBy: "purchase" })
                .where(eq(users.id, userResult[0].id));
              console.log(`[Webhook] Purchase recorded + access granted for guest email ${email}`);
            }
          }
        }
      }

      res.json({ received: true });
    }
  );
}
