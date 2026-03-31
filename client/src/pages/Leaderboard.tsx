// TKD Top Trumps — Shared Leaderboard Page
// Shows top scores across Black Belt Edition and 2026 Edition

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";

type EditionFilter = "all" | "blackbelt" | "2026";

const MEDAL = ["🥇", "🥈", "🥉"];

const EDITION_LABELS: Record<string, string> = {
  blackbelt: "Black Belt Edition",
  "2026": "2026 Edition",
};

const EDITION_COLOURS: Record<string, string> = {
  blackbelt: "#E8001D",
  "2026": "#F5C800",
};

export default function Leaderboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<EditionFilter>("all");

  const { data: topScores = [], isLoading } = trpc.leaderboard.getTop.useQuery({
    edition: activeTab,
    limit: 50,
  });

  const { data: recentScores = [] } = trpc.leaderboard.getRecent.useQuery({ limit: 8 });

  const tabs: { id: EditionFilter; label: string }[] = [
    { id: "all", label: "🏆 All Time" },
    { id: "blackbelt", label: "⚔ Black Belt Edition" },
    { id: "2026", label: "⭐ 2026 Edition" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] to-[#0A0A0F]" />
        <div className="relative z-10 px-4 py-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 text-white/50 hover:text-white font-['Rajdhani'] text-sm tracking-wider transition-colors flex items-center gap-1"
          >
            ← HOME
          </button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <h1 className="font-['Black_Han_Sans'] text-3xl md:text-4xl tracking-wider text-white">
              LEADERBOARD
            </h1>
            <p className="text-white/50 font-['Rajdhani'] text-sm tracking-widest mt-1 uppercase">
              Train Taekwondo Schools · Top Warriors
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-['Rajdhani'] text-sm font-bold tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#E8001D] text-white shadow-lg shadow-red-900/40"
                  : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main leaderboard */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="font-['Black_Han_Sans'] text-base tracking-wider text-white/80">
                  TOP SCORES — {tabs.find(t => t.id === activeTab)?.label.toUpperCase()}
                </h2>
              </div>

              {isLoading ? (
                <div className="py-16 text-center text-white/40 font-['Rajdhani']">
                  Loading scores...
                </div>
              ) : topScores.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">🥋</div>
                  <p className="text-white/40 font-['Rajdhani'] text-base">
                    No scores yet — be the first to claim the top spot!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {topScores.map((score, index) => {
                    const winRate =
                      score.wins + score.losses + score.draws > 0
                        ? Math.round((score.wins / (score.wins + score.losses + score.draws)) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex items-center gap-4 px-4 py-3 ${
                          index < 3 ? "bg-white/5" : ""
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center font-['Black_Han_Sans'] text-lg">
                          {index < 3 ? MEDAL[index] : (
                            <span className="text-white/30 text-sm">{index + 1}</span>
                          )}
                        </div>

                        {/* Name + edition badge */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-['Rajdhani'] font-bold text-white text-base truncate">
                              {score.playerName}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-['Rajdhani'] font-bold"
                              style={{
                                background: `${EDITION_COLOURS[score.edition]}22`,
                                color: EDITION_COLOURS[score.edition],
                                border: `1px solid ${EDITION_COLOURS[score.edition]}44`,
                              }}
                            >
                              {EDITION_LABELS[score.edition]}
                            </span>
                            {score.mode === "multiplayer" && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-['Rajdhani'] bg-blue-900/30 text-blue-400 border border-blue-800/40">
                                2P
                              </span>
                            )}
                          </div>
                          <div className="text-white/40 font-['Rajdhani'] text-xs mt-0.5">
                            {score.wins}W · {score.losses}L · {score.draws}D
                          </div>
                        </div>

                        {/* Win rate */}
                        <div className="text-right">
                          <div
                            className="font-['Black_Han_Sans'] text-xl"
                            style={{ color: winRate >= 70 ? "#F5C800" : winRate >= 50 ? "#E8001D" : "rgba(255,255,255,0.4)" }}
                          >
                            {winRate}%
                          </div>
                          <div className="text-white/30 font-['Rajdhani'] text-xs">win rate</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Recent games */}
          <div className="space-y-4">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="font-['Black_Han_Sans'] text-sm tracking-wider text-white/80">
                  RECENT GAMES
                </h2>
              </div>
              {recentScores.length === 0 ? (
                <div className="py-8 text-center text-white/30 font-['Rajdhani'] text-sm">
                  No games played yet
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentScores.map((score) => (
                    <div key={score.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-['Rajdhani'] font-bold text-white text-sm">
                          {score.playerName}
                        </div>
                        <div className="text-white/40 font-['Rajdhani'] text-xs">
                          {EDITION_LABELS[score.edition]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-['Black_Han_Sans'] text-sm"
                          style={{ color: EDITION_COLOURS[score.edition] }}
                        >
                          {score.wins}W {score.losses}L
                        </div>
                        <div className="text-white/30 font-['Rajdhani'] text-xs">
                          {new Date(score.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Play buttons */}
            <div className="space-y-2">
              <button
                onClick={() => navigate("/game")}
                className="w-full py-3 rounded-lg font-['Black_Han_Sans'] text-sm tracking-wider text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "#E8001D", boxShadow: "0 0 20px rgba(232,0,29,0.3)" }}
              >
                ⚔ PLAY BLACK BELT EDITION
              </button>
              <button
                onClick={() => navigate("/2026/game")}
                className="w-full py-3 rounded-lg font-['Black_Han_Sans'] text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{ background: "#F5C800", color: "#0A0A0F", boxShadow: "0 0 20px rgba(245,200,0,0.3)" }}
              >
                ⭐ PLAY 2026 EDITION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
