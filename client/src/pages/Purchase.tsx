// TKD Trump Cards — Purchase Page
// Train Taekwondo Schools yellow/black branding
// Covers both editions with a single £2.99 one-time purchase

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const TRAIN_TKD_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-logo-DKUyabQdvztx3NkUEWhTb5.webp";

const EDITIONS = [
  {
    name: "Black Belt Edition",
    colour: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.4)",
    icon: "🥋",
    cards: "100 Black Belt Cards",
    desc: "Every black belt ever produced by Train Taekwondo Schools",
  },
  {
    name: "2026 Edition",
    colour: "#F5C800",
    bg: "rgba(245,200,0,0.08)",
    border: "rgba(245,200,0,0.4)",
    icon: "🏅",
    cards: "175 Student Cards",
    desc: "All current students across every belt rank — White to Black",
  },
];

const FEATURES = [
  { icon: "⚔️", title: "1-Player vs CPU", desc: "Battle the computer across both full card decks" },
  { icon: "👥", title: "2-Player Online Mode", desc: "Challenge a friend anywhere in the world in real time" },
  { icon: "📲", title: "Challenge a Friend", desc: "Share an invite link — they join your room instantly" },
  { icon: "🏆", title: "Live Leaderboard", desc: "Compete for the top spot on the school rankings board" },
  { icon: "📱", title: "Works on Any Device", desc: "Phone, tablet, or computer — no app store needed" },
  { icon: "♾️", title: "Lifetime Access", desc: "Pay once, play forever — no subscriptions ever" },
];

export default function Purchase() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const createCheckout = trpc.payment.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
      setLoading(false);
    },
    onError: (err) => {
      toast.error(err.message || "Could not start checkout. Please try again.");
      setLoading(false);
    },
  });

  const handleBuy = () => {
    setLoading(true);
    createCheckout.mutate({ origin: window.location.origin });
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#0D0D0D", fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: "#F5C800" }} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(245,200,0,0.15)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-white/50 hover:text-white text-sm tracking-wider transition-colors"
        >
          ← HOME
        </button>
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "#F5C800", fontFamily: "'Anton', sans-serif" }}
        >
          GET FULL ACCESS
        </span>
        <span />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">

        {/* Logo & School Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ background: "rgba(245,200,0,0.1)", border: "2px solid rgba(245,200,0,0.3)" }}
          >
            <span className="text-4xl">🥋</span>
          </div>
          <h1
            className="text-3xl font-black uppercase mb-1"
            style={{ color: "#F5C800", fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}
          >
            TKD Trump Cards
          </h1>
          <p className="text-white/50 text-sm tracking-wider">Train Taekwondo Schools · Official Card Game</p>
        </motion.div>

        {/* What's included — both editions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p
            className="text-center text-xs tracking-widest uppercase mb-4"
            style={{ color: "rgba(245,200,0,0.6)" }}
          >
            Both Editions Included
          </p>
          {EDITIONS.map((ed, i) => (
            <motion.div
              key={ed.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: ed.bg, border: `1px solid ${ed.border}` }}
            >
              <span className="text-3xl">{ed.icon}</span>
              <div className="flex-1">
                <p
                  className="font-black text-base uppercase"
                  style={{ color: ed.colour, fontFamily: "'Anton', sans-serif" }}
                >
                  {ed.name}
                </p>
                <p className="text-white/80 text-sm font-semibold">{ed.cards}</p>
                <p className="text-white/40 text-xs">{ed.desc}</p>
              </div>
              <div
                className="text-xs font-black px-2 py-1 rounded-lg"
                style={{ background: ed.colour, color: "#0D0D0D", fontFamily: "'Anton', sans-serif" }}
              >
                INCLUDED
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #1a1600 0%, #0d0d0d 100%)",
            border: "2px solid rgba(245,200,0,0.5)",
            boxShadow: "0 0 50px rgba(245,200,0,0.12)",
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "rgba(245,200,0,0.6)" }}
          >
            One-Time Purchase · Both Editions
          </p>
          <div className="flex items-start justify-center gap-1 mb-2">
            <span className="text-2xl mt-2" style={{ color: "#F5C800" }}>£</span>
            <span
              className="leading-none"
              style={{ color: "#F5C800", fontFamily: "'Anton', sans-serif", fontSize: "5rem" }}
            >
              2
            </span>
            <span
              className="mt-4 text-4xl"
              style={{ color: "#F5C800", fontFamily: "'Anton', sans-serif" }}
            >
              .99
            </span>
          </div>
          <p className="text-white/30 text-xs mb-6">Pay once · Play forever · No subscription</p>

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-4 font-black text-xl tracking-wider rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading ? "rgba(245,200,0,0.4)" : "#F5C800",
              color: "#0D0D0D",
              fontFamily: "'Anton', sans-serif",
              boxShadow: loading ? "none" : "0 0 30px rgba(245,200,0,0.3)",
            }}
          >
            {loading ? "⏳ LOADING..." : "🥋 BUY NOW — £2.99"}
          </button>

          <p className="text-white/25 text-xs mt-3">
            🔒 Secure payment via Stripe · All major cards accepted
          </p>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <h3
            className="text-xs tracking-widest uppercase text-center mb-4"
            style={{ color: "rgba(245,200,0,0.6)" }}
          >
            Everything You Get
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{f.title}</p>
                  <p className="text-white/40 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Test card notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(245,200,0,0.06)", border: "1px solid rgba(245,200,0,0.2)" }}
        >
          <p className="text-xs" style={{ color: "rgba(245,200,0,0.7)" }}>
            🧪 <strong>Test mode active</strong> — Use card <strong>4242 4242 4242 4242</strong> with any future date and any CVC to test the payment flow.
          </p>
        </motion.div>

        {/* School footer */}
        <div className="text-center pb-6">
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Train Taekwondo Schools · Est. 2026
          </p>
          <p className="text-white/10 text-xs mt-1">태권도 · TAEKWONDO · BLACK BELT WARRIORS</p>
        </div>

      </div>

      {/* Bottom accent bar */}
      <div className="h-1 w-full" style={{ background: "#F5C800" }} />
    </div>
  );
}
