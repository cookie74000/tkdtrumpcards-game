/**
 * AuthGate — wraps any page that requires login + purchase access.
 *
 * Behaviour:
 *  - Not logged in  → shows a "Login to Play" screen
 *  - Logged in, no access → shows a "Get Access" screen linking to /purchase
 *  - Logged in, has access → renders children
 *  - Owner / admin → always passes through
 */

import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [, navigate] = useLocation();
  const { data: me, isLoading: meLoading } = trpc.auth.me.useQuery();
  const { data: access, isLoading: accessLoading } = trpc.payment.hasAccess.useQuery(undefined, {
    enabled: !!me, // only check access once we know the user
  });

  // ── Loading ───────────────────────────────────────────────────────────────
  if (meLoading || (me && accessLoading)) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!me) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(232,0,29,0.15)", border: "2px solid #E8001D" }}
        >
          <Lock className="w-10 h-10 text-[#E8001D]" />
        </div>
        <h1 className="text-white font-['Black_Han_Sans'] text-3xl mb-3 tracking-wider">
          LOGIN REQUIRED
        </h1>
        <p className="text-white/60 font-['Rajdhani'] text-lg mb-8 max-w-sm">
          You need to log in to play TKD Trump Cards. It only takes a few seconds.
        </p>
        <a
          href={getLoginUrl()}
          className="px-10 py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-xl tracking-wider rounded-lg hover:bg-[#C80019] transition-colors"
          style={{ boxShadow: "0 0 24px rgba(232,0,29,0.4)" }}
        >
          🔑 LOGIN TO PLAY
        </a>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-white/40 font-['Rajdhani'] text-sm hover:text-white/70 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // ── Logged in but no access ───────────────────────────────────────────────
  if (!access?.hasAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(201,168,76,0.15)", border: "2px solid #C9A84C" }}
        >
          <ShieldCheck className="w-10 h-10 text-[#C9A84C]" />
        </div>
        <h1 className="text-white font-['Black_Han_Sans'] text-3xl mb-3 tracking-wider">
          ACCESS REQUIRED
        </h1>
        <p className="text-white/60 font-['Rajdhani'] text-lg mb-2 max-w-sm">
          Hey {me.name ?? "Warrior"} — you're logged in, but you need a one-time pass to unlock the full game.
        </p>
        <p className="text-[#C9A84C] font-['Rajdhani'] text-base mb-8">
          One-time payment · Both editions · Play forever
        </p>
        <button
          onClick={() => navigate("/purchase")}
          className="px-10 py-4 bg-[#C9A84C] text-black font-['Black_Han_Sans'] text-xl tracking-wider rounded-lg hover:bg-[#E8C85A] transition-colors"
          style={{ boxShadow: "0 0 24px rgba(201,168,76,0.4)" }}
        >
          🥋 GET ACCESS — £2.99
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-white/40 font-['Rajdhani'] text-sm hover:text-white/70 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // ── Has access — render the protected page ────────────────────────────────
  return <>{children}</>;
}
