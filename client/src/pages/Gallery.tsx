// TKD Top Trumps — Gallery Page
// Design: Dark Dojo Warrior — obsidian black, crimson, gold
// Browse all 80 black belt cards with search and filter

import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { blackbelts, STAT_LABELS, STAT_COLORS, STAT_ICONS, type BlackBelt, type StatKey } from "@/lib/blackbelts";

const DAN_ORDER: Record<string, number> = {
  "1st Dan": 1, "2nd Dan": 2, "3rd Dan": 3, "4th Dan": 4, "5th Dan": 5,
  "6th Dan": 6, "7th Dan": 7, "8th Dan": 8, "9th Dan": 9,
};

function MiniCard({ card, onClick }: { card: BlackBelt; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="tkd-card w-full text-left transition-all duration-200 hover:scale-105 hover:border-[#C9A84C]/60 active:scale-95"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: '0 0 25px rgba(201,168,76,0.25)' }}
    >
      <div className="aspect-[3/2] overflow-hidden rounded-t-xl relative">
        <img src={card.photo} alt={card.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
        <div className="absolute top-2 right-2">
          <span className="dan-badge text-[10px]">{card.dan}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-white font-['Black_Han_Sans'] text-sm leading-tight truncate">{card.name}</p>
        <p className="text-[#C9A84C]/70 font-['Rajdhani'] text-xs truncate mt-0.5">{card.special_move}</p>
        <div className="grid grid-cols-5 gap-1 mt-2">
          {(['power', 'speed', 'technique', 'flexibility', 'aura'] as StatKey[]).map(stat => (
            <div key={stat} className="text-center">
              <div className="text-[10px] text-white/40">{STAT_ICONS[stat]}</div>
              <div className="font-['Bebas_Neue'] text-sm leading-none" style={{ color: STAT_COLORS[stat] }}>
                {card[stat]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function CardModal({ card, onClose }: { card: BlackBelt; onClose: () => void }) {
  const statKeys: StatKey[] = ['power', 'speed', 'technique', 'flexibility', 'aura'];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="tkd-card w-full max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="aspect-[3/2] overflow-hidden rounded-t-xl relative">
          <img src={card.photo} alt={card.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="dan-badge">{card.dan}</span>
          </div>
          <div className="absolute top-3 left-3 text-white/40 font-['Rajdhani'] text-xs">
            #{String(card.id).padStart(2, '0')}
          </div>
          <button
            onClick={onClose}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white/60 hover:text-white flex items-center justify-center text-lg transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-white font-['Black_Han_Sans'] text-2xl">{card.name}</h2>
          <p className="text-[#C9A84C] font-['Rajdhani'] text-sm tracking-wider">✦ {card.special_move}</p>
        </div>
        <div className="px-5 pb-5 space-y-2">
          {statKeys.map(stat => (
            <div key={stat} className="flex items-center gap-3">
              <span className="text-white/60 font-['Rajdhani'] font-semibold text-sm w-24 flex items-center gap-1">
                <span>{STAT_ICONS[stat]}</span>
                <span>{STAT_LABELS[stat]}</span>
              </span>
              <div className="flex-1 stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${card[stat]}%`,
                    background: `linear-gradient(90deg, ${STAT_COLORS[stat]}88, ${STAT_COLORS[stat]})`,
                  }}
                />
              </div>
              <span className="font-['Bebas_Neue'] text-xl w-8 text-right" style={{ color: STAT_COLORS[stat] }}>
                {card[stat]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState('');
  const [filterDan, setFilterDan] = useState('all');
  const [sortBy, setSortBy] = useState<'id' | StatKey>('id');
  const [selectedCard, setSelectedCard] = useState<BlackBelt | null>(null);

  const danOptions = useMemo(() => {
    const dans = Array.from(new Set(blackbelts.map(b => b.dan)));
    return dans.sort((a, b) => (DAN_ORDER[a] || 0) - (DAN_ORDER[b] || 0));
  }, []);

  const filtered = useMemo(() => {
    let list = [...blackbelts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b => b.name.toLowerCase().includes(q) || b.special_move.toLowerCase().includes(q));
    }
    if (filterDan !== 'all') {
      list = list.filter(b => b.dan === filterDan);
    }
    if (sortBy === 'id') {
      list.sort((a, b) => a.id - b.id);
    } else {
      list.sort((a, b) => b[sortBy] - a[sortBy]);
    }
    return list;
  }, [search, filterDan, sortBy]);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-sm border-b border-[#C9A84C]/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-[#C9A84C]/60 hover:text-[#C9A84C] font-['Rajdhani'] text-sm transition-colors flex items-center gap-1 shrink-0"
          >
            ← HOME
          </button>
          <h1 className="text-white font-['Black_Han_Sans'] text-xl tracking-wider">BLACK BELT GALLERY</h1>
          <button
            onClick={() => navigate("/game")}
            className="px-4 py-1.5 bg-[#E8001D] text-white font-['Rajdhani'] font-semibold text-sm rounded-lg hover:bg-[#FF1A35] transition-colors shrink-0"
          >
            ⚔ PLAY
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search warriors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-[#1A1A24] border border-[#C9A84C]/20 text-white font-['Rajdhani'] text-sm px-4 py-2 rounded-lg placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50"
          />

          {/* Dan filter */}
          <select
            value={filterDan}
            onChange={e => setFilterDan(e.target.value)}
            className="bg-[#1A1A24] border border-[#C9A84C]/20 text-white font-['Rajdhani'] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#C9A84C]/50"
          >
            <option value="all">All Dan Grades</option>
            {danOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'id' | StatKey)}
            className="bg-[#1A1A24] border border-[#C9A84C]/20 text-white font-['Rajdhani'] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#C9A84C]/50"
          >
            <option value="id">Sort: Card #</option>
            <option value="power">Sort: Power</option>
            <option value="speed">Sort: Speed</option>
            <option value="technique">Sort: Technique</option>
            <option value="flexibility">Sort: Flexibility</option>
            <option value="aura">Sort: Aura</option>
          </select>
        </div>

        <div className="max-w-6xl mx-auto mt-2">
          <span className="text-white/40 font-['Rajdhani'] text-xs">
            {filtered.length} of {blackbelts.length} warriors
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
            >
              <MiniCard card={card} onClick={() => setSelectedCard(card)} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🥋</div>
            <p className="text-white/40 font-['Rajdhani'] text-lg">No warriors found</p>
          </div>
        )}
      </div>

      {/* Card modal */}
      <AnimatePresenceWrapper>
        {selectedCard && (
          <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresenceWrapper>
    </div>
  );
}

// Wrapper to avoid import issues
import { AnimatePresence } from "framer-motion";
function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
