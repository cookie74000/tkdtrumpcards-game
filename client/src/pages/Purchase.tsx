// TKD Top Trumps — Purchase / Paywall Page
// Shows pricing, features, and triggers Stripe Checkout

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-logo-DKUyabQdvztx3NkUEWhTb5.webp";

const FEATURES = [
  { icon: "🥋", title: "100 Black Belt Cards", desc: "Every black belt ever produced by the school" },
  { icon: "⚔", title: "1-Player vs CPU", desc: "Battle the computer with the full 100-card deck" },
  { icon: "👥", title: "2-Player Wi-Fi Mode", desc: "Challenge a friend on the same network in real time" },
  { icon: "🏆", title: "6 Epic Categories", desc: "Power, Speed, Technique, Flexibility, Aura & Special Move" },
  { icon: "📱", title: "Works on Any Device", desc: "Phone, tablet, or computer — no app store needed" },
  { icon: "♾️", title: "Lifetime Access", desc: "Pay once, play forever — no subscriptions" },
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
    <div className="min-h-screen bg-[#0A0A0F] text-white font-['Rajdhani']">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white text-sm tracking-wider transition-colors"
        >
          ← HOME
        </button>
        <h1 className="font-['Black_Han_Sans'] text-[#C9A84C] tracking-wider text-sm">GET FULL ACCESS</h1>
        <span />
      </div>

      <div className="max-w-md mx-auto px-4 py-8 space-y-8">

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <img src={LOGO} alt="TKD Top Trumps" className="w-32 mx-auto mb-4 mix-blend-lighten" />
          <h2 className="font-['Black_Han_Sans'] text-3xl text-white mb-1">BLACK BELT EDITION</h2>
          <p className="text-white/50 text-sm">The official card game of your Taekwondo school</p>
        </motion.div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-[#C9A84C]/60 p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)",
            boxShadow: "0 0 40px rgba(201,168,76,0.15)",
          }}
        >
          <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mb-2">One-Time Purchase</p>
          <div className="flex items-start justify-center gap-1 mb-1">
            <span className="text-[#C9A84C] font-['Rajdhani'] text-2xl mt-2">£</span>
            <span className="font-['Black_Han_Sans'] text-[#C9A84C] text-7xl leading-none">2</span>
            <span className="font-['Black_Han_Sans'] text-[#C9A84C] text-4xl mt-4">.99</span>
          </div>
          <p className="text-white/40 text-xs mb-6">Pay once · Play forever · No subscription</p>

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-xl tracking-wider rounded-xl transition-all hover:bg-[#C80019] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 0 30px rgba(232,0,29,0.4)" }}
          >
            {loading ? "⏳ Loading..." : "⚔ BUY NOW — £2.99"}
          </button>

          <p className="text-white/30 text-xs mt-3">
            🔒 Secure payment via Stripe · All major cards accepted
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="font-['Black_Han_Sans'] text-[#C9A84C] text-sm tracking-wider text-center">WHAT YOU GET</h3>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-['Black_Han_Sans'] text-white text-sm">{f.title}</p>
                <p className="text-white/50 text-xs">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Test card notice */}
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4 text-center">
          <p className="text-yellow-400 text-xs font-['Rajdhani']">
            🧪 <strong>Test mode active</strong> — Use card <strong>4242 4242 4242 4242</strong> with any future date and any CVC to test the payment flow.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs pb-4">
          태권도 · TAEKWONDO · BLACK BELT WARRIORS
        </p>
      </div>
    </div>
  );
}
