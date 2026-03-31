// TKD Top Trumps — 2026 Edition Multiplayer
// Reuses the same Socket.io room system as the Black Belt Edition

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { students2026, Student2026, BELT_COLOURS } from "../lib/students2026";

const PLACEHOLDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-placeholder-DxJvGfTWVpELbNvbfDPNWD.webp";

type GamePhase = "lobby" | "waiting" | "playing" | "gameover";
type Stat = "power" | "speed" | "technique" | "flexibility" | "aura";

const STAT_LABELS: Record<Stat, string> = { power: "Power", speed: "Speed", technique: "Technique", flexibility: "Flexibility", aura: "Aura" };
const STAT_ICONS: Record<Stat, string> = { power: "💥", speed: "⚡", technique: "🎯", flexibility: "🌀", aura: "✨" };

function BeltBadge({ belt, beltColor }: { belt: string; beltColor: string }) {
  const isDark = !["#FFFFFF", "#F5C800", "#FFB300", "#76B900"].includes(beltColor);
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{ background: beltColor, color: isDark ? "#fff" : "#000", border: beltColor === "#FFFFFF" ? "1px solid rgba(0,0,0,0.2)" : "none", fontFamily: "'Rajdhani', sans-serif" }}>
      {belt}
    </span>
  );
}

export default function Multiplayer2026() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const socketRef = useRef<Socket | null>(null);
  const urlRoomCode = new URLSearchParams(searchString).get("room")?.toUpperCase() ?? "";
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState(urlRoomCode);
  const [isHost, setIsHost] = useState(false);
  const [opponentName, setOpponentName] = useState("");
  const [myCard, setMyCard] = useState<Student2026 | null>(null);
  const [oppCard, setOppCard] = useState<Student2026 | null>(null);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [roundResult, setRoundResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [myCardsLeft, setMyCardsLeft] = useState(0);
  const [oppCardsLeft, setOppCardsLeft] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("room:created", ({ roomCode: rc }: { roomCode: string }) => {
      setRoomCode(rc);
      setIsHost(true);
      setPhase("waiting");
      setStatusMsg("Room created! Share the code with your opponent.");
    });

    socket.on("room:joined", ({ roomCode: rc, opponentName: oName }: { roomCode: string; opponentName: string }) => {
      setRoomCode(rc);
      setOpponentName(oName);
      setPhase("playing");
      setStatusMsg(`Joined! Playing against ${oName}`);
    });

    socket.on("room:opponentJoined", ({ opponentName: oName }: { opponentName: string }) => {
      setOpponentName(oName);
      setPhase("playing");
      setStatusMsg(`${oName} joined! Game starting...`);
    });

    socket.on("game:newRound", ({ myCard: mc, oppCard: oc, myCardsLeft: mcl, oppCardsLeft: ocl, isMyTurn: imt }: any) => {
      const myStudent = students2026.find(s => s.id === mc.id) || mc;
      const oppStudent = students2026.find(s => s.id === oc.id) || oc;
      setMyCard(myStudent);
      setOppCard(oppStudent);
      setMyCardsLeft(mcl);
      setOppCardsLeft(ocl);
      setIsMyTurn(imt);
      setSelectedStat(null);
      setRevealed(false);
      setRoundResult(null);
      setStatusMsg(imt ? "Your turn — pick a stat!" : `${opponentName || "Opponent"}'s turn...`);
    });

    socket.on("game:roundResult", ({ stat, myVal, oppVal, result, myScore: ms, oppScore: os }: any) => {
      setSelectedStat(stat);
      setRevealed(true);
      setRoundResult(result);
      setMyScore(ms);
      setOppScore(os);
    });

    socket.on("game:over", ({ winner: w }: { winner: string }) => {
      setWinner(w);
      setPhase("gameover");
    });

    socket.on("room:error", ({ message }: { message: string }) => {
      setError(message);
    });

    socket.on("room:opponentLeft", () => {
      setStatusMsg("Opponent disconnected.");
      setPhase("lobby");
    });

    return () => { socket.disconnect(); };
  }, []);

  const createRoom = () => {
    if (!playerName.trim()) { setError("Please enter your name first."); return; }
    setError("");
    socketRef.current?.emit("room:create", { playerName: playerName.trim(), edition: "2026" });
  };

  const joinRoom = () => {
    if (!playerName.trim()) { setError("Please enter your name first."); return; }
    if (!joinCode.trim()) { setError("Please enter a room code."); return; }
    setError("");
    socketRef.current?.emit("room:join", { playerName: playerName.trim(), roomCode: joinCode.trim().toUpperCase(), edition: "2026" });
  };

  const selectStat = (stat: Stat) => {
    if (!isMyTurn || selectedStat) return;
    socketRef.current?.emit("game:selectStat", { stat });
    setSelectedStat(stat);
    setStatusMsg("Waiting for result...");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/2026/multiplayer?room=${roomCode}`;
    if (navigator.share) {
      navigator.share({
        title: "TKD Top Trumps 2026 — Challenge!",
        text: `${playerName} is challenging you to a 2026 Edition battle! Join room ${roomCode}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }, [roomCode, playerName]);

  // Lobby
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />
        <button onClick={() => navigate("/2026")} className="absolute top-4 left-4 text-[#F5C800]/60 hover:text-[#F5C800] text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>← HOME</button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">👥</div>
            <h1 className="text-3xl font-black text-[#F5C800] uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>2-PLAYER MODE</h1>
            <p className="text-white/50 text-sm mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>2026 Edition · Connect over Wi-Fi</p>
          </div>

          <div className="mb-4">
            <label className="text-[#F5C800]/70 text-xs uppercase tracking-wider mb-1 block" style={{ fontFamily: "'Rajdhani', sans-serif" }}>YOUR NAME</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white outline-none"
              style={{ background: "rgba(245,200,0,0.08)", border: "1px solid rgba(245,200,0,0.3)", fontFamily: "'Rajdhani', sans-serif" }}
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-3 text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{error}</p>}

          <button onClick={createRoom} className="w-full py-3 font-black text-black text-lg rounded-lg uppercase mb-4" style={{ background: "#F5C800", fontFamily: "'Anton', sans-serif" }}>
            ⚔ CREATE ROOM
          </button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#F5C800]/20" />
            <span className="text-[#F5C800]/40 text-xs uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>OR JOIN ROOM</span>
            <div className="flex-1 h-px bg-[#F5C800]/20" />
          </div>

          <input
            type="text"
            placeholder="Enter 4-letter room code..."
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            maxLength={4}
            className="w-full px-4 py-3 rounded-lg text-white text-center text-xl font-black tracking-[0.5em] outline-none mb-3"
            style={{ background: "rgba(245,200,0,0.08)", border: "1px solid rgba(245,200,0,0.3)", fontFamily: "'Anton', sans-serif" }}
          />
          <button onClick={joinRoom} className="w-full py-3 border-2 border-[#F5C800]/50 text-[#F5C800] font-black text-lg rounded-lg uppercase hover:bg-[#F5C800]/10 transition-colors" style={{ fontFamily: "'Anton', sans-serif" }}>
            🥋 JOIN ROOM
          </button>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
      </div>
    );
  }

  // Waiting for opponent
  if (phase === "waiting") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h2 className="text-2xl font-black text-[#F5C800] uppercase mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>WAITING FOR OPPONENT</h2>
          <p className="text-white/50 mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Share this code with your friend:</p>
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="text-5xl font-black text-[#F5C800] tracking-[0.3em]" style={{ fontFamily: "'Anton', sans-serif" }}>{roomCode}</div>
            <button onClick={copyCode} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: "rgba(245,200,0,0.15)", color: "#F5C800", fontFamily: "'Rajdhani', sans-serif" }}>
              {copied ? "✓ COPIED" : "COPY"}
            </button>
          </div>
          {/* Challenge a Friend share button */}
          <button
            onClick={handleShare}
            className="mx-auto flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm tracking-wider transition-all hover:scale-105 active:scale-95 mb-4"
            style={{ background: copied ? "rgba(245,200,0,0.2)" : "#F5C800", color: "#0D0D0D", fontFamily: "'Anton', sans-serif" }}
          >
            {copied ? "✅ LINK COPIED!" : "📲 CHALLENGE A FRIEND"}
          </button>
          <p className="text-white/30 text-sm mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Sends a link that drops them straight into this room</p>
          <p className="text-white/30 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Both players need the app open on their device</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
      </div>
    );
  }

  // Game over
  if (phase === "gameover") {
    const iWon = winner === playerName;
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="text-7xl mb-4">{iWon ? "🏆" : winner === "draw" ? "🤝" : "😤"}</div>
          <h1 className="text-4xl font-black text-[#F5C800] uppercase mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            {iWon ? "CHAMPION!" : winner === "draw" ? "DRAW!" : `${winner} WINS!`}
          </h1>
          <p className="text-white/60 mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {playerName}: {myScore} · {opponentName}: {oppScore}
          </p>
          <button onClick={() => { setPhase("lobby"); setMyScore(0); setOppScore(0); }} className="px-8 py-3 font-black text-black text-lg rounded-lg uppercase" style={{ background: "#F5C800", fontFamily: "'Anton', sans-serif" }}>
            PLAY AGAIN
          </button>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
      </div>
    );
  }

  // Playing
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(245,200,0,0.15)" }}>
        <div className="text-[#F5C800]/60 text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Room: {roomCode}</div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[#F5C800] font-black text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>{myScore}</div>
            <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>YOU</div>
          </div>
          <div className="text-white/30 text-sm">vs</div>
          <div className="text-center">
            <div className="text-white/60 font-black text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>{oppScore}</div>
            <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{opponentName || "OPP"}</div>
          </div>
        </div>
        <div className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{myCardsLeft} vs {oppCardsLeft}</div>
      </div>

      {/* Status */}
      <div className="text-center py-2 text-sm font-bold" style={{ color: isMyTurn ? "#F5C800" : "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
        {statusMsg}
      </div>

      {/* Round result */}
      <AnimatePresence>
        {revealed && roundResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-2 font-black text-lg uppercase"
            style={{
              fontFamily: "'Anton', sans-serif",
              background: roundResult === "win" ? "rgba(245,200,0,0.15)" : roundResult === "lose" ? "rgba(255,50,50,0.15)" : "rgba(100,100,100,0.15)",
              color: roundResult === "win" ? "#F5C800" : roundResult === "lose" ? "#ff6b6b" : "#aaa",
            }}>
            {roundResult === "win" ? "⚡ YOU WIN THIS ROUND!" : roundResult === "lose" ? "💀 OPPONENT WINS!" : "🤝 DRAW!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-4">
        {/* My card */}
        {myCard && (
          <div className="rounded-2xl overflow-hidden w-full max-w-[280px]" style={{ background: "linear-gradient(145deg, #1a1a1a, #111)", border: `2px solid ${roundResult === "win" ? "#F5C800" : "rgba(245,200,0,0.2)"}`, boxShadow: roundResult === "win" ? "0 0 30px rgba(245,200,0,0.4)" : "none" }}>
            <div className="h-1" style={{ background: myCard.beltColor }} />
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(245,200,0,0.08)" }}>
              <span className="text-[#F5C800] font-black text-xs uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>⚔ YOUR CARD</span>
              <BeltBadge belt={myCard.belt} beltColor={myCard.beltColor} />
            </div>
            <div className="relative h-36 bg-[#0D0D0D] overflow-hidden">
              <img src={myCard.photo || PLACEHOLDER} alt={myCard.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <p className="text-white font-black text-base" style={{ fontFamily: "'Anton', sans-serif" }}>{myCard.name}</p>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {(Object.keys(STAT_LABELS) as Stat[]).map(stat => (
                <button key={stat} onClick={() => selectStat(stat)} disabled={!isMyTurn || !!selectedStat}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isMyTurn && !selectedStat ? "hover:bg-[#F5C800]/10 cursor-pointer" : "cursor-default"} ${selectedStat === stat ? "ring-2 ring-[#F5C800] bg-[#F5C800]/10" : ""}`}>
                  <span className="text-sm w-4">{STAT_ICONS[stat]}</span>
                  <span className="text-white/60 text-xs uppercase flex-1 text-left" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{STAT_LABELS[stat]}</span>
                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#F5C800]" style={{ width: `${myCard[stat]}%` }} />
                  </div>
                  <span className="text-[#F5C800] font-black text-xs w-7 text-right" style={{ fontFamily: "'Anton', sans-serif" }}>{myCard[stat]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-[#F5C800]/30 font-black text-2xl" style={{ fontFamily: "'Anton', sans-serif" }}>VS</div>

        {/* Opponent card */}
        {oppCard && (
          <div className="rounded-2xl overflow-hidden w-full max-w-[280px]" style={{ background: "linear-gradient(145deg, #1a1a1a, #111)", border: `2px solid ${roundResult === "lose" ? "#ff6b6b" : "rgba(245,200,0,0.2)"}` }}>
            <div className="h-1" style={{ background: oppCard.beltColor }} />
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(245,200,0,0.08)" }}>
              <span className="text-white/50 font-black text-xs uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>👤 {opponentName || "OPPONENT"}</span>
              <BeltBadge belt={oppCard.belt} beltColor={oppCard.beltColor} />
            </div>
            <div className="relative h-36 bg-[#0D0D0D] overflow-hidden">
              <img src={oppCard.photo || PLACEHOLDER} alt={oppCard.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <p className="text-white font-black text-base" style={{ fontFamily: "'Anton', sans-serif" }}>{revealed ? oppCard.name : "???"}</p>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {(Object.keys(STAT_LABELS) as Stat[]).map(stat => (
                <div key={stat} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${selectedStat === stat ? "ring-2 ring-[#F5C800]/50 bg-[#F5C800]/05" : ""}`}>
                  <span className="text-sm w-4">{STAT_ICONS[stat]}</span>
                  <span className="text-white/60 text-xs uppercase flex-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{STAT_LABELS[stat]}</span>
                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-white/30" style={{ width: revealed ? `${oppCard[stat]}%` : 0 }} />
                  </div>
                  <span className="text-white/50 font-black text-xs w-7 text-right" style={{ fontFamily: "'Anton', sans-serif" }}>{revealed ? oppCard[stat] : "??"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
    </div>
  );
}
