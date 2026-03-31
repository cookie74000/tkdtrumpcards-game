// TKD Top Trumps — Two-Player Wi-Fi Multiplayer Page
// Players create or join a room via a 4-letter code, then battle in real time

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  BlackBelt,
  StatKey,
  STAT_LABELS,
  STAT_COLORS,
  STAT_ICONS,
} from "../lib/blackbelts";

// ── Types ──────────────────────────────────────────────────────────────────────

type Screen =
  | "lobby"         // enter name, choose create/join
  | "waiting"       // host waiting for opponent
  | "joining"       // entering room code
  | "countdown"     // brief countdown before game
  | "playing"       // active game
  | "result"        // round result
  | "gameover";     // final result

interface RoundResult {
  stat: StatKey;
  card1: BlackBelt;
  card2: BlackBelt;
  val1: number;
  val2: number;
  winner: "p1" | "p2" | "draw";
  p1DeckSize: number;
  p2DeckSize: number;
  round: number;
  currentTurn: "p1" | "p2";
  gameOver: boolean;
  gameWinner: "p1" | "p2" | null;
  gameWinnerName: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const CARD_BACK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-back-esYavXz3ruiAtQRiiR62fH.webp";

function StatBar({ label, icon, color, value, highlight }: {
  label: string; icon: string; color: string; value: number; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${highlight ? "bg-white/10 ring-1 ring-white/40" : ""}`}>
      <span className="text-sm w-5">{icon}</span>
      <span className="font-['Rajdhani'] text-white/70 text-sm flex-1">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="font-['Black_Han_Sans'] text-white text-sm w-8 text-right">{value}</span>
    </div>
  );
}

function CardDisplay({ card, isMe, isWinner, isLoser }: {
  card: BlackBelt; isMe: boolean; isWinner?: boolean; isLoser?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: isMe ? 30 : -30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl overflow-hidden border-2 transition-all ${
        isWinner ? "border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.5)]" :
        isLoser ? "border-red-600/60" :
        "border-white/20"
      }`}
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)" }}
    >
      {/* Photo */}
      <div className="relative h-36 overflow-hidden">
        <img src={card.photo} alt={card.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-['Rajdhani'] font-bold bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40">
            {card.dan}
          </span>
        </div>
        {isWinner && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl"
            >🏆</motion.div>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="font-['Black_Han_Sans'] text-white text-base mb-0.5">{card.name}</h3>
        <p className="text-[#C9A84C]/70 font-['Rajdhani'] text-xs mb-2">✦ {card.special_move}</p>
        <div className="space-y-0.5">
          {(["power", "speed", "technique", "flexibility", "aura"] as StatKey[]).map((s) => (
            <StatBar
              key={s}
              label={STAT_LABELS[s]}
              icon={STAT_ICONS[s]}
              color={STAT_COLORS[s]}
              value={card[s] as number}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Multiplayer() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const socketRef = useRef<Socket | null>(null);

  // Pre-fill room code from invite link (?room=XXXX)
  const urlRoomCode = new URLSearchParams(searchString).get("room")?.toUpperCase() ?? "";

  // Lobby state
  const [screen, setScreen] = useState<Screen>("lobby");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [myRoomCode, setMyRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState(urlRoomCode);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [myIndex, setMyIndex] = useState<0 | 1>(0);

  // Game state
  const [myDeck, setMyDeck] = useState<BlackBelt[]>([]);
  const [opponentDeckSize, setOpponentDeckSize] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<"p1" | "p2">("p1");
  const [round, setRound] = useState(1);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [gameWinnerName, setGameWinnerName] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  const isMyTurn = (myIndex === 0 && currentTurn === "p1") || (myIndex === 1 && currentTurn === "p2");

  // ── Socket setup ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const socket = io({ path: "/api/socket.io", transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("room_created", ({ roomId }: { roomId: string }) => {
      setMyRoomCode(roomId);
      setScreen("waiting");
    });

    socket.on("room_joined", ({ playerIndex }: { playerIndex: number }) => {
      setMyIndex(playerIndex as 0 | 1);
    });

    socket.on("player_joined", ({ players }: { players: { name: string }[] }) => {
      if (players.length === 2) {
        const other = players.find((p) => p.name !== playerName);
        if (other) setOpponentName(other.name);
        // Host starts the game
        if (myIndex === 0) {
          socket.emit("start_game", { roomId: myRoomCode });
        }
      }
    });

    socket.on("game_started", (data: {
      myDeck: BlackBelt[];
      myIndex: number;
      opponentName: string;
      opponentDeckSize: number;
      currentTurn: "p1" | "p2";
      round: number;
    }) => {
      setMyDeck(data.myDeck);
      setMyIndex(data.myIndex as 0 | 1);
      setOpponentName(data.opponentName);
      setOpponentDeckSize(data.opponentDeckSize);
      setCurrentTurn(data.currentTurn);
      setRound(data.round);
      setScreen("countdown");
      let c = 3;
      setCountdown(c);
      const timer = setInterval(() => {
        c--;
        setCountdown(c);
        if (c <= 0) {
          clearInterval(timer);
          setScreen("playing");
        }
      }, 1000);
    });

    socket.on("round_result", (result: RoundResult) => {
      setLastResult(result);
      setMyDeck((prev) => {
        // Rebuild deck based on result
        const myKey = myIndex === 0 ? "p1" : "p2";
        const newSize = myKey === "p1" ? result.p1DeckSize : result.p2DeckSize;
        // We don't have the full new deck from server — just update size indicator
        // The server sends updated decks only on game_started; here we simulate
        return prev; // will be updated via game_started on rematch
      });
      setOpponentDeckSize(myIndex === 0 ? result.p2DeckSize : result.p1DeckSize);
      setCurrentTurn(result.currentTurn);
      setRound(result.round);

      if (result.gameOver) {
        setGameWinnerName(result.gameWinnerName);
        setScreen("gameover");
      } else {
        setScreen("result");
      }
    });

    socket.on("opponent_disconnected", ({ message }: { message: string }) => {
      setErrorMsg(message);
      setScreen("lobby");
    });

    socket.on("error", ({ message }: { message: string }) => {
      setErrorMsg(message);
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleCreate = () => {
    if (!playerName.trim()) { setErrorMsg("Please enter your name first."); return; }
    setErrorMsg("");
    setMyIndex(0);
    socketRef.current?.emit("create_room", { playerName: playerName.trim() });
  };

  const handleJoin = () => {
    if (!playerName.trim()) { setErrorMsg("Please enter your name first."); return; }
    if (!joinCode.trim()) { setErrorMsg("Please enter the room code."); return; }
    setErrorMsg("");
    setMyIndex(1);
    setMyRoomCode(joinCode.toUpperCase());
    socketRef.current?.emit("join_room", { roomId: joinCode.toUpperCase(), playerName: playerName.trim() });
    setScreen("waiting");
  };

  // Share invite link
  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/multiplayer?room=${myRoomCode}`;
    if (navigator.share) {
      navigator.share({
        title: "TKD Top Trumps — Challenge!",
        text: `${playerName} is challenging you to a Top Trumps battle! Join room ${myRoomCode}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }, [myRoomCode, playerName]);

  const handlePickStat = useCallback((stat: StatKey) => {
    if (!isMyTurn) return;
    socketRef.current?.emit("play_stat", { roomId: myRoomCode, stat });
  }, [isMyTurn, myRoomCode]);

  const handleNextRound = () => {
    setScreen("playing");
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  const myCard = myDeck[0];
  const opponentCard = lastResult ? (myIndex === 0 ? lastResult.card2 : lastResult.card1) : null;
  const myResultCard = lastResult ? (myIndex === 0 ? lastResult.card1 : lastResult.card2) : null;
  const myVal = lastResult ? (myIndex === 0 ? lastResult.val1 : lastResult.val2) : 0;
  const oppVal = lastResult ? (myIndex === 0 ? lastResult.val2 : lastResult.val1) : 0;
  const iWon = lastResult ? (
    (myIndex === 0 && lastResult.winner === "p1") ||
    (myIndex === 1 && lastResult.winner === "p2")
  ) : false;
  const isDraw = lastResult?.winner === "draw";

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-['Rajdhani']">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white font-['Rajdhani'] text-sm tracking-wider transition-colors"
        >
          ← HOME
        </button>
        <h1 className="font-['Black_Han_Sans'] text-[#C9A84C] tracking-wider text-sm">
          👥 2-PLAYER MODE
        </h1>
        {screen === "playing" || screen === "result" ? (
          <span className="text-white/40 text-xs">ROUND {round}</span>
        ) : <span />}
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── LOBBY ── */}
          {screen === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-['Black_Han_Sans'] text-2xl text-white mb-2">BATTLE A FRIEND</h2>
                <p className="text-white/50 text-sm">Connect over Wi-Fi — both players need this app open</p>
              </div>

              {/* Name input */}
              <div>
                <label className="text-[#C9A84C]/80 text-xs tracking-wider uppercase block mb-2">Your Warrior Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 font-['Rajdhani'] text-base"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg px-4 py-2">{errorMsg}</p>
              )}

              {/* Create Room */}
              <button
                onClick={handleCreate}
                className="w-full py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-lg tracking-wider rounded-lg hover:bg-[#C80019] transition-all active:scale-95"
                style={{ boxShadow: "0 0 20px rgba(232,0,29,0.3)" }}
              >
                ⚔ CREATE ROOM
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">OR JOIN A ROOM</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Join Room */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 4-letter room code..."
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 font-['Black_Han_Sans'] text-xl tracking-[0.4em] text-center uppercase"
                />
                <button
                  onClick={handleJoin}
                  className="w-full py-4 border border-[#C9A84C]/60 text-[#C9A84C] font-['Black_Han_Sans'] text-lg tracking-wider rounded-lg hover:bg-[#C9A84C]/10 transition-all active:scale-95"
                >
                  🥋 JOIN ROOM
                </button>
              </div>
            </motion.div>
          )}

          {/* ── WAITING ── */}
          {screen === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 py-12"
            >
              {myIndex === 0 ? (
                <>
                  <div>
                    <p className="text-white/50 text-sm mb-3 tracking-wider uppercase">Your Room Code</p>
                    <div
                      className="inline-block px-8 py-4 rounded-2xl border-2 border-[#C9A84C]/60 bg-[#C9A84C]/5"
                      style={{ boxShadow: "0 0 30px rgba(201,168,76,0.2)" }}
                    >
                      <span className="font-['Black_Han_Sans'] text-[#C9A84C] text-5xl tracking-[0.3em]">
                        {myRoomCode}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm mt-3">Share this code — or use the button below</p>
                  </div>

                  {/* Challenge a Friend share button */}
                  <button
                    onClick={handleShare}
                    className="mx-auto flex items-center gap-2 px-6 py-3 rounded-xl font-['Black_Han_Sans'] text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
                    style={{ background: copied ? "rgba(201,168,76,0.2)" : "rgba(232,0,29,0.15)", border: "1px solid rgba(232,0,29,0.5)", color: copied ? "#C9A84C" : "#E8001D" }}
                  >
                    {copied ? "✅ LINK COPIED!" : "📲 CHALLENGE A FRIEND"}
                  </button>
                  <p className="text-white/30 text-xs">Sends a link that drops them straight into this room</p>

                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="text-white/40 text-sm">Waiting for opponent to join...</p>
                </>
              ) : (
                <>
                  <div className="text-6xl animate-pulse">🥋</div>
                  <p className="text-white/60 text-lg">Joining room <span className="text-[#C9A84C] font-['Black_Han_Sans']">{myRoomCode}</span>...</p>
                  <p className="text-white/30 text-sm">Waiting for host to start the game</p>
                </>
              )}
              <button
                onClick={() => { setScreen("lobby"); setErrorMsg(""); }}
                className="text-white/30 hover:text-white/60 text-sm underline transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* ── COUNTDOWN ── */}
          {screen === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 space-y-4"
            >
              <p className="text-white/50 tracking-wider uppercase text-sm">
                {playerName} vs {opponentName}
              </p>
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-['Black_Han_Sans'] text-[#E8001D] text-8xl"
                style={{ textShadow: "0 0 40px rgba(232,0,29,0.6)" }}
              >
                {countdown > 0 ? countdown : "FIGHT!"}
              </motion.div>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {screen === "playing" && myCard && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Score bar */}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#C9A84C] font-['Black_Han_Sans']">{playerName}</span>
                <div className="flex-1 flex gap-1">
                  <div className="h-2 rounded-full bg-[#C9A84C]" style={{ width: `${(myDeck.length / 100) * 100}%`, transition: "width 0.5s" }} />
                </div>
                <span className="text-white/40 text-xs">{myDeck.length} cards</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-xs">{opponentDeckSize} cards</span>
                <div className="flex-1 flex justify-end gap-1">
                  <div className="h-2 rounded-full bg-[#E8001D]" style={{ width: `${(opponentDeckSize / 100) * 100}%`, transition: "width 0.5s" }} />
                </div>
                <span className="text-white/60 font-['Black_Han_Sans'] text-xs">{opponentName}</span>
              </div>

              {/* Opponent card back */}
              <div className="text-center">
                <p className="text-white/30 text-xs mb-2 tracking-wider uppercase">Opponent's Card</p>
                <div className="inline-block w-24 h-36 rounded-xl overflow-hidden border border-white/20">
                  <img src={CARD_BACK} alt="Opponent card" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* My card */}
              <div>
                <p className="text-[#C9A84C]/60 text-xs mb-2 tracking-wider uppercase text-center">Your Card</p>
                <div className="rounded-2xl overflow-hidden border-2 border-[#C9A84C]/40"
                  style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)" }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={myCard.photo} alt={myCard.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-['Rajdhani'] font-bold bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40">
                        {myCard.dan}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-['Black_Han_Sans'] text-white text-base mb-0.5">{myCard.name}</h3>
                    <p className="text-[#C9A84C]/70 font-['Rajdhani'] text-xs mb-2">✦ {myCard.special_move}</p>
                    {/* Stat buttons */}
                    <div className="space-y-1">
                      {(["power", "speed", "technique", "flexibility", "aura"] as StatKey[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handlePickStat(s)}
                          disabled={!isMyTurn}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${
                            isMyTurn
                              ? "hover:bg-white/10 active:scale-95 cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <span className="text-sm w-5">{STAT_ICONS[s]}</span>
                          <span className="font-['Rajdhani'] text-white/70 text-sm flex-1">{STAT_LABELS[s]}</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${myCard[s]}%`, backgroundColor: STAT_COLORS[s] }}
                            />
                          </div>
                          <span className="font-['Black_Han_Sans'] text-white text-sm w-8 text-right">{myCard[s]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isMyTurn ? (
                <p className="text-center text-[#C9A84C]/80 text-sm tracking-wider animate-pulse">
                  ⚔ YOUR TURN — Pick your best stat!
                </p>
              ) : (
                <p className="text-center text-white/30 text-sm tracking-wider">
                  Waiting for {opponentName} to pick...
                </p>
              )}
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {screen === "result" && lastResult && myResultCard && opponentCard && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Result banner */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-center py-3 px-4 rounded-xl font-['Black_Han_Sans'] text-lg tracking-wider ${
                  isDraw
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : iWon
                    ? "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40"
                    : "bg-red-600/20 text-red-400 border border-red-600/30"
                }`}
              >
                {isDraw ? "⚖ DRAW!" : iWon ? `🏆 YOU WIN! +2 cards` : `💀 ${opponentName} wins this round`}
                <div className="text-xs font-['Rajdhani'] mt-1 opacity-70">
                  {STAT_ICONS[lastResult.stat]} {STAT_LABELS[lastResult.stat]}: {myVal} vs {oppVal}
                </div>
              </motion.div>

              {/* Cards side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-center text-xs text-white/40 mb-1 uppercase tracking-wider">You</p>
                  <CardDisplay card={myResultCard} isMe={true} isWinner={iWon && !isDraw} isLoser={!iWon && !isDraw} />
                </div>
                <div>
                  <p className="text-center text-xs text-white/40 mb-1 uppercase tracking-wider">{opponentName}</p>
                  <CardDisplay card={opponentCard} isMe={false} isWinner={!iWon && !isDraw} isLoser={iWon && !isDraw} />
                </div>
              </div>

              {/* Deck sizes */}
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-[#C9A84C] font-['Black_Han_Sans'] text-2xl">{myDeck.length}</p>
                  <p className="text-white/40 text-xs">Your cards</p>
                </div>
                <div>
                  <p className="text-white/60 font-['Black_Han_Sans'] text-2xl">{opponentDeckSize}</p>
                  <p className="text-white/40 text-xs">{opponentName}'s cards</p>
                </div>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-lg tracking-wider rounded-lg hover:bg-[#C80019] transition-all active:scale-95"
              >
                NEXT ROUND ⚔
              </button>
            </motion.div>
          )}

          {/* ── GAME OVER ── */}
          {screen === "gameover" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-8xl"
              >
                {gameWinnerName === playerName ? "🏆" : "💀"}
              </motion.div>
              <div>
                <h2 className="font-['Black_Han_Sans'] text-3xl text-white mb-2">
                  {gameWinnerName === playerName ? "VICTORY!" : "DEFEATED!"}
                </h2>
                <p className="text-white/50 text-base">
                  {gameWinnerName === playerName
                    ? `You conquered ${opponentName}!`
                    : `${gameWinnerName} wins this battle.`}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setScreen("lobby"); setMyDeck([]); setLastResult(null); }}
                  className="w-full py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-lg tracking-wider rounded-lg hover:bg-[#C80019] transition-all active:scale-95"
                >
                  ⚔ PLAY AGAIN
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-4 border border-white/20 text-white/60 font-['Black_Han_Sans'] text-lg tracking-wider rounded-lg hover:bg-white/5 transition-all"
                >
                  ← HOME
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
