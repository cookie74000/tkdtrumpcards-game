import Stripe from "stripe";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { purchases, scores } from "../drizzle/schema";

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

  leaderboard: router({
    // Submit a score after a game
    submit: publicProcedure
      .input(
        z.object({
          playerName: z.string().min(1).max(64),
          edition: z.enum(["blackbelt", "2026"]),
          mode: z.enum(["solo", "multiplayer"]),
          wins: z.number().int().min(0),
          losses: z.number().int().min(0),
          draws: z.number().int().min(0),
          totalCards: z.number().int().min(0),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(scores).values({
          playerName: input.playerName,
          edition: input.edition,
          mode: input.mode,
          wins: input.wins,
          losses: input.losses,
          draws: input.draws,
          totalCards: input.totalCards,
        });
        return { success: true };
      }),

    // Get top scores — optionally filtered by edition
    getTop: publicProcedure
      .input(
        z.object({
          edition: z.enum(["blackbelt", "2026", "all"]).default("all"),
          limit: z.number().int().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const query = db
          .select()
          .from(scores)
          .orderBy(desc(scores.wins), desc(scores.totalCards))
          .limit(input.limit);
        if (input.edition !== "all") {
          return await db
            .select()
            .from(scores)
            .where(eq(scores.edition, input.edition))
            .orderBy(desc(scores.wins), desc(scores.totalCards))
            .limit(input.limit);
        }
        return await query;
      }),

    // Get recent scores
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db
          .select()
          .from(scores)
          .orderBy(desc(scores.createdAt))
          .limit(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
