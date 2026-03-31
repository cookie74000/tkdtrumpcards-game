import Stripe from "stripe";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { purchases, scores, students, BELT_GRADES } from "../drizzle/schema";

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
      if (!ctx.user) return { hasAccess: false, reason: "unauthenticated" };
      // Owner always has access
      const { ENV } = await import("./_core/env");
      if (ctx.user.openId === ENV.ownerOpenId || ctx.user.role === "admin") {
        return { hasAccess: true, reason: "admin" };
      }
      // Check hasAccess flag on user record
      if (ctx.user.hasAccess) return { hasAccess: true, reason: "granted" };
      // Fallback: check purchases table
      const db = await getDb();
      if (!db) return { hasAccess: false, reason: "db_unavailable" };
      const result = await db
        .select()
        .from(purchases)
        .where(eq(purchases.userId, ctx.user.id))
        .limit(1);
      return { hasAccess: result.length > 0, reason: result.length > 0 ? "purchase" : "none" };
    }),

    // Admin: grant free access to a user by email
    grantAccess: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        grantedBy: z.enum(["admin", "owner"]).default("admin"),
      }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { like } = await import("drizzle-orm");
        const { users } = await import("../drizzle/schema");
        const found = await db.select().from(users).where(like(users.email, input.email)).limit(1);
        if (!found.length) throw new Error("User not found with that email");
        await db.update(users)
          .set({ hasAccess: true, accessGrantedBy: input.grantedBy })
          .where(eq(users.id, found[0].id));
        return { success: true, name: found[0].name };
      }),

    // Admin: revoke access from a user by email
    revokeAccess: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { like } = await import("drizzle-orm");
        const { users } = await import("../drizzle/schema");
        const found = await db.select().from(users).where(like(users.email, input.email)).limit(1);
        if (!found.length) throw new Error("User not found with that email");
        await db.update(users)
          .set({ hasAccess: false, accessGrantedBy: undefined })
          .where(eq(users.id, found[0].id));
        return { success: true };
      }),

    // Admin: list all users with their access status
    listUsers: protectedProcedure.query(async ({ ctx }) => {
      const { ENV } = await import("./_core/env");
      if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
        throw new Error("Not authorised");
      }
      const db = await getDb();
      if (!db) return [];
      const { users } = await import("../drizzle/schema");
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        hasAccess: users.hasAccess,
        accessGrantedBy: users.accessGrantedBy,
        createdAt: users.createdAt,
      }).from(users).orderBy(desc(users.createdAt));
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

  // ─── STUDENT MANAGEMENT (admin belt upgrades) ──────────────────────────────
  students: router({
    // List all students (paginated, searchable)
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        grade: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(200),
        offset: z.number().int().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { students: [], total: 0 };
        const { like, and } = await import("drizzle-orm");
        let conditions: ReturnType<typeof like>[] = [];
        if (input.search) {
          conditions.push(like(students.name, `%${input.search}%`));
        }
        if (input.grade) {
          conditions.push(like(students.grade, `%${input.grade}%`));
        }
        const query = conditions.length > 0
          ? db.select().from(students).where(and(...conditions))
          : db.select().from(students);
        const rows = await query.limit(input.limit).offset(input.offset);
        return { students: rows, total: rows.length };
      }),

    // Update a student's belt grade (admin only — protected by owner check)
    updateGrade: protectedProcedure
      .input(z.object({
        studentId: z.number().int(),
        grade: z.enum(BELT_GRADES),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only the app owner can update grades
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(students)
          .set({ grade: input.grade })
          .where(eq(students.id, input.studentId));
        return { success: true };
      }),

    // Update a student's photo URL
    updatePhoto: protectedProcedure
      .input(z.object({
        studentId: z.number().int(),
        photoUrl: z.string().url(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(students)
          .set({ photoUrl: input.photoUrl })
          .where(eq(students.id, input.studentId));
        return { success: true };
      }),

    // Get a single student by ID
    getById: publicProcedure
      .input(z.object({ studentId: z.number().int() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db.select().from(students).where(eq(students.id, input.studentId)).limit(1);
        return rows[0] ?? null;
      }),

    // Create a new student (admin only)
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(128),
        grade: z.enum(BELT_GRADES),
        membershipNumber: z.string().min(1).max(32),
        photoUrl: z.string().url().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        // Auto-generate stats based on belt grade
        const gradeIndex = BELT_GRADES.indexOf(input.grade);
        const base = 30 + Math.round((gradeIndex / (BELT_GRADES.length - 1)) * 50);
        const rand = (offset: number) => Math.min(100, Math.max(10, base + offset + Math.round((Math.random() - 0.5) * 20)));
        const specialMoves = ["Turning Kick", "Side Kick", "Back Kick", "Axe Kick", "Hook Kick", "Flying Kick", "Spinning Heel Kick", "Tornado Kick", "Jump Spinning Back Kick", "Crescent Kick"];
        const specialMove = specialMoves[Math.floor(Math.random() * specialMoves.length)];
        await db.insert(students).values({
          name: input.name,
          grade: input.grade,
          membershipNumber: input.membershipNumber,
          photoUrl: input.photoUrl ?? null,
          power: rand(0),
          speed: rand(5),
          technique: rand(-5),
          flexibility: rand(3),
          aura: rand(-3),
          specialMove,
          active: true,
        });
        return { success: true };
      }),

    // Delete a student (admin only)
    remove: protectedProcedure
      .input(z.object({ studentId: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(students).where(eq(students.id, input.studentId));
        return { success: true };
      }),

    // Get a presigned upload URL for a student photo
    getPhotoUploadUrl: protectedProcedure
      .input(z.object({ filename: z.string(), contentType: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new Error("Not authorised");
        }
        const { storagePut } = await import("./storage");
        const ext = input.filename.split(".").pop() ?? "jpg";
        const key = `student-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        // Upload a tiny placeholder to get the URL, then return the key for direct upload
        // We return the CDN-style key so the client can use the presigned approach
        return { key, uploadReady: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
