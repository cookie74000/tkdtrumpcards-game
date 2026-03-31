// TKD Trump Cards — 2026 Edition Game Page
// 1-Player vs CPU with Train Taekwondo yellow/black branding

import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { students2026, Student2026, BELT_COLOURS } from "../lib/students2026";
import { trpc } from "@/lib/trpc";

const PLACEHOLDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-placeholder-DxJvGfTWVpELbNvbfDPNWD.webp";

type Stat = "power" | "speed" | "technique" | "flexibility" | "aura";

const STAT_LABELS: Record<Stat, string> = {
  power: "Power",
  speed: "Speed",
  technique: "Technique",
  flexibility: "Flexibility",
  aura: "Aura",
};

const STAT_ICONS: Record<Stat, string> = {
  power: "💥",
  speed: "⚡",
  technique: "🎯",
  flexibility: "🌀",
  aura: "✨",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function BeltBadge({ belt, beltColor }: { belt: string; beltColor: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{
        background: beltColor,
        color: beltColor === "#FFFFFF" || beltColor === "#F5C800" || beltColor === "#FFB300" || beltColor === "#76B900" ? "#000" : "#fff",
        border: beltColor === "#FFFFFF" ? "1px solid rgba(0,0,0,0.2)" : "none",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {belt}
    </span>
  );
}

function Card2026({
  student,
  isPlayer,
  revealed,
  selectedStat,
  onSelectStat,
  winner,
}: {
  student: Student2026;
  isPlayer: boolean;
  revealed: boolean;
  selectedStat: Stat | null;
  onSelectStat?: (stat: Stat) => void;
  winner?: "player" | "cpu" | "draw" | null;
}) {
  const borderColor =
    winner === "player" && isPlayer ? "#F5C800"
    : winner === "cpu" && !isPlayer ? "#F5C800"
    : winner === "draw" ? "#888"
    : "rgba(245,200,0,0.2)";

  const glowColor =
    winner === "player" && isPlayer ? "rgba(245,200,0,0.5)"
    : winner === "cpu" && !isPlayer ? "rgba(245,200,0,0.5)"
    : "transparent";

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden w-full max-w-[280px]"
      style={{
        background: "linear-gradient(145deg, #1a1a1a, #111)",
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.6)`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Card header */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ background: "rgba(245,200,0,0.1)", borderBottom: "1px solid rgba(245,200,0,0.2)" }}
      >
        <span
          className="text-[#F5C800] font-black text-xs uppercase tracking-wider"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {isPlayer ? "⚔ YOUR CARD" : "🤖 CPU CARD"}
        </span>
        <BeltBadge belt={student.belt} beltColor={student.beltColor} />
      </div>

      {/* Photo */}
      <div className="relative h-40 overflow-hidden bg-[#0D0D0D]">
        <img
          src={student.photo || PLACEHOLDER}
          alt={student.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p
            className="text-white font-black text-lg leading-tight"
            style={{ fontFamily: "'Anton', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
          >
            {student.name}
          </p>
          <p
            className="text-[#F5C800]/80 text-xs tracking-wider"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {student.specialMove}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 space-y-1.5">
        {(Object.keys(STAT_LABELS) as Stat[]).map((stat) => {
          const val = student[stat] as number;
          const isSelected = selectedStat === stat;
          const isWinnerStat = isSelected && winner;
          return (
            <button
              key={stat}
              onClick={() => isPlayer && onSelectStat && onSelectStat(stat)}
              disabled={!isPlayer || !!selectedStat}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isPlayer && !selectedStat ? "hover:bg-[#F5C800]/10 cursor-pointer" : "cursor-default"
              } ${isSelected ? "ring-2 ring-[#F5C800]" : ""}`}
              style={{
                background: isSelected
                  ? "rgba(245,200,0,0.15)"
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-base w-5">{STAT_ICONS[stat]}</span>
              <span
                className="text-white/70 text-xs uppercase tracking-wider flex-1 text-left"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {STAT_LABELS[stat]}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#F5C800" }}
                    initial={{ width: 0 }}
                    animate={{ width: revealed || isPlayer ? `${val}%` : 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
                <span
                  className="text-[#F5C800] font-black text-sm w-8 text-right"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  {revealed || isPlayer ? val : "??"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Game2026() {
  const [, navigate] = useLocation();
  const [playerDeck, setPlayerDeck] = useState<Student2026[]>(() => shuffle(students2026).slice(0, Math.floor(students2026.length / 2)));
  const [cpuDeck, setCpuDeck] = useState<Student2026[]>(() => shuffle(students2026).slice(Math.floor(students2026.length / 2)));
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [roundResult, setRoundResult] = useState<"player" | "cpu" | "draw" | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const playerCard = playerDeck[0];
  const cpuCard = cpuDeck[0];

  const handleSelectStat = useCallback((stat: Stat) => {
    if (selectedStat || !playerCard || !cpuCard) return;
    setSelectedStat(stat);
    setRevealed(true);

    const pVal = playerCard[stat] as number;
    const cVal = cpuCard[stat] as number;
    let result: "player" | "cpu" | "draw";
    if (pVal > cVal) result = "player";
    else if (cVal > pVal) result = "cpu";
    else result = "draw";

    setRoundResult(result);
    setShowResult(true);

    setTimeout(() => {
      const newPlayerDeck = [...playerDeck.slice(1)];
      const newCpuDeck = [...cpuDeck.slice(1)];

      if (result === "player") {
        newPlayerDeck.push(playerCard, cpuCard);
        setPlayerScore(s => s + 1);
      } else if (result === "cpu") {
        newCpuDeck.push(cpuCard, playerCard);
        setCpuScore(s => s + 1);
      } else {
        newPlayerDeck.push(playerCard);
        newCpuDeck.push(cpuCard);
      }

      if (newPlayerDeck.length === 0 || newCpuDeck.length === 0) {
        setGameOver(true);
      }

      setPlayerDeck(newPlayerDeck);
      setCpuDeck(newCpuDeck);
      setSelectedStat(null);
      setRevealed(false);
      setRoundResult(null);
      setShowResult(false);
    }, 2200);
  }, [selectedStat, playerCard, cpuCard, playerDeck, cpuDeck]);

  const submitScore = trpc.leaderboard.submit.useMutation();
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitName, setSubmitName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSubmitScore = () => {
    if (!submitName.trim()) return;
    submitScore.mutate({
      playerName: submitName.trim(),
      edition: "2026",
      mode: "solo",
      wins: playerScore,
      losses: cpuScore,
      draws: 0,
      totalCards: playerScore + cpuScore,
    }, {
      onSuccess: () => { setScoreSubmitted(true); setShowNameInput(false); },
    });
  };

  const restart = () => {
    const all = shuffle(students2026);
    const half = Math.floor(all.length / 2);
    setPlayerDeck(all.slice(0, half));
    setCpuDeck(all.slice(half));
    setSelectedStat(null);
    setRevealed(false);
    setRoundResult(null);
    setPlayerScore(0);
    setCpuScore(0);
    setGameOver(false);
    setShowResult(false);
  };

  if (gameOver) {
    const playerWon = playerDeck.length > cpuDeck.length;
    const draw = playerDeck.length === cpuDeck.length;
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="text-7xl mb-4">{draw ? "🤝" : playerWon ? "🏆" : "😤"}</div>
          <h1
            className="text-4xl font-black text-[#F5C800] uppercase mb-2"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {draw ? "IT'S A DRAW!" : playerWon ? "CHAMPION!" : "CPU WINS!"}
          </h1>
          <p className="text-white/60 mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Final score — You: {playerScore} · CPU: {cpuScore}
          </p>
          {/* Leaderboard submission */}
          {!scoreSubmitted ? (
            <div className="mb-4">
              {!showNameInput ? (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="w-full py-3 mb-3 rounded-lg font-black text-sm uppercase"
                  style={{ background: "rgba(245,200,0,0.15)", border: "1px solid rgba(245,200,0,0.4)", color: "#F5C800", fontFamily: "'Anton', sans-serif" }}
                >
                  🏆 SAVE TO LEADERBOARD
                </button>
              ) : (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={submitName}
                    onChange={e => setSubmitName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                    placeholder="Enter your name..."
                    maxLength={20}
                    autoFocus
                    className="flex-1 rounded-lg px-3 py-2 text-white placeholder-white/30 outline-none"
                    style={{ background: "rgba(245,200,0,0.08)", border: "1px solid rgba(245,200,0,0.4)", fontFamily: "'Rajdhani', sans-serif" }}
                  />
                  <button
                    onClick={handleSubmitScore}
                    disabled={!submitName.trim() || submitScore.isPending}
                    className="px-4 py-2 rounded-lg font-black text-sm text-black disabled:opacity-50"
                    style={{ background: "#F5C800", fontFamily: "'Anton', sans-serif" }}
                  >
                    {submitScore.isPending ? '...' : 'SAVE'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 text-center">
              <p className="text-[#F5C800] text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>✅ Score saved!</p>
              <button onClick={() => navigate('/leaderboard')} className="text-white/40 hover:text-white/70 text-xs underline mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>View Leaderboard →</button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={restart}
              className="px-8 py-3 font-black text-black text-lg rounded-lg uppercase"
              style={{ background: "#F5C800", fontFamily: "'Anton', sans-serif" }}
            >
              ⚔ PLAY AGAIN
            </button>
            <button
              onClick={() => navigate("/2026")}
              className="px-8 py-3 border border-[#F5C800]/40 text-[#F5C800]/70 text-sm rounded-lg uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              ← BACK TO HOME
            </button>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(245,200,0,0.15)" }}
      >
        <button
          onClick={() => navigate("/2026")}
          className="text-[#F5C800]/60 hover:text-[#F5C800] text-sm font-bold transition-colors"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          ← HOME
        </button>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[#F5C800] font-black text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>{playerScore}</div>
            <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>YOU</div>
          </div>
          <div className="text-white/30 text-sm">vs</div>
          <div className="text-center">
            <div className="text-white/60 font-black text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>{cpuScore}</div>
            <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>CPU</div>
          </div>
        </div>
        <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          {playerDeck.length} vs {cpuDeck.length}
        </div>
      </div>

      {/* Round result banner */}
      <AnimatePresence>
        {showResult && roundResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-2 font-black text-lg uppercase"
            style={{
              fontFamily: "'Anton', sans-serif",
              background: roundResult === "player" ? "rgba(245,200,0,0.15)"
                : roundResult === "cpu" ? "rgba(255,50,50,0.15)"
                : "rgba(100,100,100,0.15)",
              color: roundResult === "player" ? "#F5C800"
                : roundResult === "cpu" ? "#ff6b6b"
                : "#aaa",
            }}
          >
            {roundResult === "player" ? "⚡ YOU WIN THIS ROUND!" : roundResult === "cpu" ? "💀 CPU WINS THIS ROUND!" : "🤝 DRAW!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6">
        {playerCard && (
          <Card2026
            student={playerCard}
            isPlayer={true}
            revealed={revealed}
            selectedStat={selectedStat}
            onSelectStat={handleSelectStat}
            winner={roundResult}
          />
        )}

        <div className="flex flex-col items-center gap-2">
          <div
            className="text-[#F5C800]/40 font-black text-2xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            VS
          </div>
          {!selectedStat && (
            <p
              className="text-white/40 text-xs text-center max-w-[120px]"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Tap a stat to battle!
            </p>
          )}
        </div>

        {cpuCard && (
          <Card2026
            student={cpuCard}
            isPlayer={false}
            revealed={revealed}
            selectedStat={selectedStat}
            winner={roundResult}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
    </div>
  );
}
