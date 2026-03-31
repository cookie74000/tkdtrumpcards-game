// TKD Trump Cards — 2026 Edition Gallery
// Browse all 175 student cards, filter by belt rank, search by name

import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { students2026, Student2026, BeltRank, BELT_COLOURS } from "../lib/students2026";

const PLACEHOLDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-placeholder-DxJvGfTWVpELbNvbfDPNWD.webp";

const ALL_BELTS: BeltRank[] = [
  "White", "White/Yellow Tag", "Yellow", "Yellow/Orange Tag", "Orange",
  "Orange/Green Tag", "Green", "Green/Blue Tag", "Blue", "Blue/Red Tag",
  "Red", "Red/Black Tag", "Black",
];

const STAT_ICONS: Record<string, string> = {
  power: "💥", speed: "⚡", technique: "🎯", flexibility: "🌀", aura: "✨",
};

function BeltBadge({ belt, beltColor }: { belt: string; beltColor: string }) {
  const isDark = !["#FFFFFF", "#F5C800", "#FFB300", "#76B900"].includes(beltColor);
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{
        background: beltColor,
        color: isDark ? "#fff" : "#000",
        border: beltColor === "#FFFFFF" ? "1px solid rgba(0,0,0,0.2)" : "none",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {belt}
    </span>
  );
}

function StudentCard({ student, onClick }: { student: Student2026; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onClick}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(145deg, #1a1a1a, #111)",
        border: "1px solid rgba(245,200,0,0.15)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,200,0,0.5)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,200,0,0.15)")}
    >
      {/* Belt colour strip at top */}
      <div className="h-1.5" style={{ background: student.beltColor }} />

      {/* Photo */}
      <div className="relative h-32 bg-[#0D0D0D] overflow-hidden">
        <img
          src={student.photo || PLACEHOLDER}
          alt={student.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3">
        <p
          className="text-white font-black text-sm leading-tight mb-1 truncate"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {student.name}
        </p>
        <BeltBadge belt={student.belt} beltColor={student.beltColor} />

        {/* Mini stats */}
        <div className="mt-2 grid grid-cols-5 gap-0.5">
          {(["power", "speed", "technique", "flexibility", "aura"] as const).map(stat => (
            <div key={stat} className="flex flex-col items-center">
              <span className="text-[10px]">{STAT_ICONS[stat]}</span>
              <span
                className="text-[#F5C800] font-black text-xs"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {student[stat]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StudentModal({ student, onClose }: { student: Student2026; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="rounded-2xl overflow-hidden w-full max-w-sm"
        style={{
          background: "linear-gradient(145deg, #1e1e1e, #111)",
          border: "2px solid rgba(245,200,0,0.4)",
          boxShadow: "0 0 60px rgba(245,200,0,0.2)",
        }}
      >
        {/* Belt colour strip */}
        <div className="h-2" style={{ background: student.beltColor }} />

        {/* Photo */}
        <div className="relative h-56 bg-[#0D0D0D] overflow-hidden">
          <img
            src={student.photo || PLACEHOLDER}
            alt={student.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <p
              className="text-white font-black text-2xl leading-tight"
              style={{ fontFamily: "'Anton', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
            >
              {student.name}
            </p>
            <BeltBadge belt={student.belt} beltColor={student.beltColor} />
          </div>
        </div>

        {/* Special move */}
        <div
          className="px-4 py-2 text-center"
          style={{ background: "rgba(245,200,0,0.08)", borderBottom: "1px solid rgba(245,200,0,0.15)" }}
        >
          <p className="text-[#F5C800] text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            ⚡ Special Move: {student.specialMove}
          </p>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-2">
          {(["power", "speed", "technique", "flexibility", "aura"] as const).map(stat => (
            <div key={stat} className="flex items-center gap-3">
              <span className="text-base w-5">{STAT_ICONS[stat]}</span>
              <span
                className="text-white/60 text-xs uppercase tracking-wider w-20"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {stat}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "#F5C800" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${student[stat]}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <span
                className="text-[#F5C800] font-black text-sm w-8 text-right"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {student[stat]}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-[#F5C800]/60 text-sm font-bold uppercase tracking-wider hover:text-[#F5C800] transition-colors"
          style={{ fontFamily: "'Rajdhani', sans-serif", borderTop: "1px solid rgba(245,200,0,0.15)" }}
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery2026() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState<BeltRank | "All">("All");
  const [selected, setSelected] = useState<Student2026 | null>(null);

  const filtered = useMemo(() => {
    return students2026.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchBelt = beltFilter === "All" || s.belt === beltFilter;
      return matchSearch && matchBelt;
    });
  }, [search, beltFilter]);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F5C800] z-10" />

      {/* Header */}
      <div
        className="sticky top-1 z-10 px-4 py-3"
        style={{ background: "rgba(13,13,13,0.95)", borderBottom: "1px solid rgba(245,200,0,0.15)", backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate("/2026")}
              className="text-[#F5C800]/60 hover:text-[#F5C800] text-sm font-bold transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              ← HOME
            </button>
            <h1
              className="text-[#F5C800] font-black text-lg uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              2026 EDITION — {filtered.length} WARRIORS
            </h1>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-white text-sm mb-3 outline-none"
            style={{
              background: "rgba(245,200,0,0.08)",
              border: "1px solid rgba(245,200,0,0.2)",
              fontFamily: "'Rajdhani', sans-serif",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(245,200,0,0.6)")}
            onBlur={e => (e.target.style.borderColor = "rgba(245,200,0,0.2)")}
          />

          {/* Belt filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setBeltFilter("All")}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all"
              style={{
                background: beltFilter === "All" ? "#F5C800" : "rgba(245,200,0,0.1)",
                color: beltFilter === "All" ? "#000" : "#F5C800",
                border: "1px solid rgba(245,200,0,0.3)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              All ({students2026.length})
            </button>
            {ALL_BELTS.map(belt => {
              const count = students2026.filter(s => s.belt === belt).length;
              if (count === 0) return null;
              const bc = BELT_COLOURS[belt];
              const isActive = beltFilter === belt;
              return (
                <button
                  key={belt}
                  onClick={() => setBeltFilter(belt)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all"
                  style={{
                    background: isActive ? bc : "rgba(255,255,255,0.05)",
                    color: isActive
                      ? (["#FFFFFF", "#F5C800", "#FFB300", "#76B900"].includes(bc) ? "#000" : "#fff")
                      : "#aaa",
                    border: `1px solid ${bc}40`,
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {belt.replace("/", "/")} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <AnimatePresence>
            {filtered.map(student => (
              <StudentCard key={student.id} student={student} onClick={() => setSelected(student)} />
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/40" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            No students found matching your search.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
    </div>
  );
}
