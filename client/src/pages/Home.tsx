// TKD Top Trumps — Home Page
// Design: Dark Dojo Warrior — obsidian black, crimson, gold
// Full-bleed hero with animated entrance, CTA to start game

import { useLocation } from "wouter";
import { motion } from "framer-motion";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-hero-bg-CiufLda7rgjKnb6EQTvxTc.webp";
const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-logo-DKUyabQdvztx3NkUEWhTb5.webp";
const CARD_BACK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-back-esYavXz3ruiAtQRiiR62fH.webp";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0A0A0F]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]/80" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <img src={LOGO} alt="TKD Top Trumps" className="w-64 md:w-80 drop-shadow-2xl mix-blend-lighten" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[#C9A84C] font-['Rajdhani'] text-lg md:text-xl tracking-[0.3em] uppercase mb-2 text-center"
        >
          Black Belt Edition
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-white/60 font-['Rajdhani'] text-base tracking-wider mb-12 text-center"
        >
          80 Black Belt Warriors · 6 Epic Categories
        </motion.p>

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
              className="absolute inset-0 rounded-xl overflow-hidden border border-[#C9A84C]/30"
              style={{
                transform: `rotate(${(i - 1.5) * 5}deg) translateY(${i * -3}px)`,
                zIndex: i,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
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
            onClick={() => navigate("/game")}
            className="relative group px-10 py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-xl tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 30px rgba(232,0,29,0.4), 0 4px 20px rgba(0,0,0,0.5)' }}
          >
            <span className="relative z-10">⚔ PLAY NOW</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8001D] to-[#A80015] group-hover:from-[#FF1A35] group-hover:to-[#C80019] transition-all duration-300" />
          </button>

          <button
            onClick={() => navigate("/gallery")}
            className="px-10 py-4 border border-[#C9A84C]/60 text-[#C9A84C] font-['Black_Han_Sans'] text-xl tracking-wider rounded-lg transition-all duration-300 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] hover:scale-105 active:scale-95"
          >
            🥋 VIEW CARDS
          </button>
        </motion.div>

        {/* How to play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 max-w-2xl w-full"
        >
          <div className="tkd-card p-6">
            <h2 className="text-[#C9A84C] font-['Black_Han_Sans'] text-lg mb-4 tracking-wider text-center">HOW TO PLAY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { step: "1", title: "Draw a Card", desc: "You and the computer each get a card from the shuffled deck" },
                { step: "2", title: "Pick a Stat", desc: "Choose your best category — Power, Speed, Technique, Flexibility, or Aura" },
                { step: "3", title: "Battle!", desc: "Highest stat wins the round and takes both cards. Most cards wins!" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#E8001D] flex items-center justify-center font-['Black_Han_Sans'] text-white text-lg">
                    {step}
                  </div>
                  <p className="text-white font-['Rajdhani'] font-semibold text-base">{title}</p>
                  <p className="text-white/50 font-['Rajdhani'] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8 text-white/30 font-['Rajdhani'] text-sm tracking-wider text-center"
        >
          태권도 · TAEKWONDO · BLACK BELT WARRIORS
        </motion.p>
      </div>
    </div>
  );
}
