// TKD Trump Cards — 2026 Edition Home Page
// Design: Train Taekwondo Schools brand — electric yellow #F5C800, deep black, bold sans-serif

import { useLocation } from "wouter";
import { motion } from "framer-motion";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd2026-hero-bg-Sk8MoBGCqH6oZLibcnHfth.webp";
const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/train-tkd-logo_a30804ac.webp";
const CARD_BACK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd2026-card-back-KnJWGZTgoY7XtP6v2jXZC7.webp";

export default function Home2026() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0D0D0D]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 via-transparent to-[#0D0D0D]/80" />

      {/* Yellow top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />

      {/* Back to Black Belt Edition link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-[#F5C800]/70 hover:text-[#F5C800] font-bold text-sm tracking-wider transition-colors"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        ← BLACK BELT EDITION
      </motion.button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <img
            src={LOGO}
            alt="Train Taekwondo Schools"
            className="w-64 md:w-80 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(245,200,0,0.5))' }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-2"
        >
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight text-[#F5C800] uppercase leading-none"
            style={{ fontFamily: "'Anton', sans-serif", textShadow: '0 0 40px rgba(245,200,0,0.4), 0 4px 20px rgba(0,0,0,0.8)' }}
          >
            TOP TRUMPS
          </h1>
          <div
            className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.2em] mt-1"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            2026 EDITION
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white/60 text-base tracking-wider mb-8 text-center"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          175 Warriors · All Belt Ranks · Every Student
        </motion.p>

        {/* Belt rank colour strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex gap-1 mb-8 rounded-full overflow-hidden"
        >
          {[
            { color: "#FFFFFF", label: "White" },
            { color: "#F5C800", label: "Yellow" },
            { color: "#FF6D00", label: "Orange" },
            { color: "#2E7D32", label: "Green" },
            { color: "#1565C0", label: "Blue" },
            { color: "#C62828", label: "Red" },
            { color: "#111111", label: "Black" },
          ].map(({ color, label }) => (
            <div
              key={label}
              className="w-8 h-3 rounded-sm"
              style={{ backgroundColor: color, border: color === "#FFFFFF" ? "1px solid rgba(255,255,255,0.3)" : "none" }}
              title={label}
            />
          ))}
        </motion.div>

        {/* Card preview stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-32 h-48 mb-10"
        >
          {[3, 2, 1, 0].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                transform: `rotate(${(i - 1.5) * 5}deg) translateY(${i * -3}px)`,
                zIndex: i,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                border: '2px solid rgba(245,200,0,0.4)',
              }}
            >
              <img src={CARD_BACK} alt="Card" className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => navigate("/2026/game")}
            className="relative group px-10 py-4 text-black font-black text-xl tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 uppercase"
            style={{
              background: '#F5C800',
              fontFamily: "'Anton', sans-serif",
              boxShadow: '0 0 30px rgba(245,200,0,0.5), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            ⚔ 1 PLAYER
          </button>

          <button
            onClick={() => navigate("/2026/multiplayer")}
            className="px-10 py-4 text-black font-black text-xl tracking-wider rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 uppercase"
            style={{
              background: 'linear-gradient(135deg, #F5C800, #E6B800)',
              fontFamily: "'Anton', sans-serif",
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            👥 2 PLAYERS
          </button>

          <button
            onClick={() => navigate("/2026/gallery")}
            className="px-10 py-4 border-2 border-[#F5C800]/60 text-[#F5C800] font-black text-xl tracking-wider rounded-lg transition-all duration-300 hover:bg-[#F5C800]/10 hover:border-[#F5C800] hover:scale-105 active:scale-95 uppercase"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            🥋 VIEW CARDS
          </button>
        </motion.div>

        {/* How to play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 max-w-2xl w-full"
        >
          <div
            className="rounded-xl p-6"
            style={{ background: 'rgba(245,200,0,0.05)', border: '1px solid rgba(245,200,0,0.2)' }}
          >
            <h2
              className="text-[#F5C800] text-lg mb-4 tracking-wider text-center font-black uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              HOW TO PLAY
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { step: "1", title: "Draw a Card", desc: "You and your opponent each get a card from the shuffled deck" },
                { step: "2", title: "Pick a Stat", desc: "Choose Power, Speed, Technique, Flexibility or Aura" },
                { step: "3", title: "Battle!", desc: "Highest stat wins the round. Most cards at the end wins!" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black text-lg"
                    style={{ background: '#F5C800', fontFamily: "'Anton', sans-serif" }}
                  >
                    {step}
                  </div>
                  <p className="text-white font-semibold text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{title}</p>
                  <p className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white/30 text-sm tracking-wider" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            TRAIN TAEKWONDO SCHOOLS · CREATING CHAMPIONS FOR LIFE SINCE 2011
          </p>
          <button
            onClick={() => navigate("/purchase")}
            className="mt-3 px-6 py-2 rounded-full text-[#F5C800]/70 text-sm tracking-wider hover:text-[#F5C800] transition-all font-semibold"
            style={{ border: '1px solid rgba(245,200,0,0.3)', fontFamily: "'Rajdhani', sans-serif" }}
          >
            💳 Get Full Access — £2.99
          </button>
        </motion.div>
      </div>

      {/* Yellow bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
    </div>
  );
}
