import Stripe from "stripe";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { purchases } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  payment: router({
    // Create a Stripe Checkout session for £2.99 app access
    createCheckout: publicProcedure
      .input(z.object({ origin: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const product = PRODUCTS.APP_ACCESS;
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: product.currency,
                unit_amount: product.price,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
              },
              quantity: 1,
            },
          ],
          customer_email: ctx.user?.email ?? undefined,
          client_reference_id: ctx.user?.id?.toString() ?? undefined,
          metadata: {
            user_id: ctx.user?.id?.toString() ?? "",
            customer_email: ctx.user?.email ?? "",
            customer_name: ctx.user?.name ?? "",
          },
          allow_promotion_codes: true,
          success_url: `${input.origin}/purchase?success=true`,
          cancel_url: `${input.origin}/purchase?cancelled=true`,
        });
        return { url: session.url };
      }),

    // Check if the current user has purchased access
    hasAccess: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { hasAccess: false };
      const db = await getDb();
      if (!db) return { hasAccess: false };
      const result = await db
        .select()
        .from(purchases)
        .where(eq(purchases.userId, ctx.user.id))
        .limit(1);
      return { hasAccess: result.length > 0 };
    }),
  }),
});

export type AppRouter = typeof appRouter;
