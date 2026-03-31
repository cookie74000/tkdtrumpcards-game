// TKD Top Trumps — Game Page
// Design: Dark Dojo Warrior — obsidian black, crimson, gold
// Full Top Trumps gameplay: player vs computer, stat selection, win/lose logic

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { blackbelts, shuffleDeck, STAT_LABELS, STAT_COLORS, STAT_ICONS, type BlackBelt, type StatKey } from "@/lib/blackbelts";
import { trpc } from "@/lib/trpc";

const CARD_BACK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-back-esYavXz3ruiAtQRiiR62fH.webp";

type GamePhase = 'dealing' | 'player_turn' | 'reveal' | 'result' | 'game_over';
type RoundResult = 'win' | 'lose' | 'draw' | null;

function StatBar({ value, color, animate }: { value: number; color: string; animate: boolean }) {
  return (
    <div className="stat-bar">
      <div
        className="stat-bar-fill"
        style={{
          width: animate ? `${value}%` : '0%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: animate ? 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        }}
      />
    </div>
  );
}

function BlackBeltCard({
  card,
  isRevealed,
  selectedStat,
  onSelectStat,
  isPlayerCard,
  result,
  animateStats,
}: {
  card: BlackBelt;
  isRevealed: boolean;
  selectedStat: StatKey | null;
  onSelectStat?: (stat: StatKey) => void;
  isPlayerCard: boolean;
  result: RoundResult;
  animateStats: boolean;
}) {
  const statKeys: StatKey[] = ['power', 'speed', 'technique', 'flexibility', 'aura'];

  const cardBorderColor = result === 'win' ? '#C9A84C' : result === 'lose' ? '#E8001D' : 'rgba(201,168,76,0.3)';
  const cardGlow = result === 'win' ? '0 0 30px rgba(201,168,76,0.5)' : result === 'lose' ? '0 0 30px rgba(232,0,29,0.3)' : '0 0 20px rgba(232,0,29,0.1)';

  return (
    <motion.div
      className="tkd-card w-full max-w-xs mx-auto"
      style={{ border: `1px solid ${cardBorderColor}`, boxShadow: cardGlow }}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Card header */}
      <div className="relative">
        <div className="aspect-[3/2] overflow-hidden rounded-t-xl relative">
          <img
            src={card.photo}
            alt={card.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
          {/* Dan badge */}
          <div className="absolute top-3 right-3">
            <span className="dan-badge text-xs">{card.dan}</span>
          </div>
          {/* Card number */}
          <div className="absolute top-3 left-3 text-white/40 font-['Rajdhani'] text-xs">
            #{String(card.id).padStart(2, '0')}
          </div>
        </div>

        {/* Name */}
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-white font-['Black_Han_Sans'] text-xl tracking-wide leading-tight">{card.name}</h3>
          <p className="text-[#C9A84C]/80 font-['Rajdhani'] text-sm tracking-widest">
            ✦ {card.special_move}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4 space-y-2">
        {statKeys.map((stat) => {
          const isSelected = selectedStat === stat;
          const canSelect = isPlayerCard && onSelectStat;
          const color = STAT_COLORS[stat];

          return (
            <button
              key={stat}
              onClick={() => canSelect && onSelectStat(stat)}
              disabled={!canSelect}
              className={`w-full text-left rounded-lg px-3 py-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-white/10 ring-1 ring-white/30'
                  : canSelect
                  ? 'hover:bg-white/5 cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-['Rajdhani'] font-semibold text-sm text-white/80 flex items-center gap-1">
                  <span>{STAT_ICONS[stat]}</span>
                  <span>{STAT_LABELS[stat]}</span>
                </span>
                <span
                  className="font-['Bebas_Neue'] text-lg leading-none"
                  style={{ color: isSelected ? color : 'rgba(255,255,255,0.7)' }}
                >
                  {card[stat]}
                </span>
              </div>
              <StatBar value={card[stat]} color={color} animate={animateStats} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function FaceDownCard({ label }: { label: string }) {
  return (
    <motion.div
      className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-[#C9A84C]/30"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="aspect-[3/4] relative">
        <img src={CARD_BACK} alt="Card back" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#C9A84C] font-['Black_Han_Sans'] text-lg tracking-wider opacity-80">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Game() {
  const [, navigate] = useLocation();
  const [playerDeck, setPlayerDeck] = useState<BlackBelt[]>([]);
  const [cpuDeck, setCpuDeck] = useState<BlackBelt[]>([]);
  const [playerCard, setPlayerCard] = useState<BlackBelt | null>(null);
  const [cpuCard, setCpuCard] = useState<BlackBelt | null>(null);
  const [phase, setPhase] = useState<GamePhase>('dealing');
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(null);
  const [result, setResult] = useState<RoundResult>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [cpuWins, setCpuWins] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const startGame = useCallback(() => {
    const shuffled = shuffleDeck(blackbelts);
    const half = Math.floor(shuffled.length / 2);
    const pDeck = shuffled.slice(0, half);
    const cDeck = shuffled.slice(half);
    setPlayerDeck(pDeck.slice(1));
    setCpuDeck(cDeck.slice(1));
    setPlayerCard(pDeck[0]);
    setCpuCard(cDeck[0]);
    setPhase('player_turn');
    setSelectedStat(null);
    setResult(null);
    setRoundCount(1);
    setPlayerWins(0);
    setCpuWins(0);
    setAnimateStats(false);
    setTimeout(() => setAnimateStats(true), 100);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleStatSelect = (stat: StatKey) => {
    if (phase !== 'player_turn' || !playerCard || !cpuCard) return;
    setSelectedStat(stat);
    setPhase('reveal');

    const playerVal = playerCard[stat];
    const cpuVal = cpuCard[stat];

    setTimeout(() => {
      let roundResult: RoundResult;
      let msg: string;

      if (playerVal > cpuVal) {
        roundResult = 'win';
        msg = `⚡ ${playerCard.name}'s ${STAT_LABELS[stat]} (${playerVal}) beats ${cpuCard.name} (${cpuVal})!`;
        setPlayerWins(w => w + 1);
      } else if (cpuVal > playerVal) {
        roundResult = 'lose';
        msg = `💀 ${cpuCard.name}'s ${STAT_LABELS[stat]} (${cpuVal}) beats your ${playerCard.name} (${playerVal})!`;
        setCpuWins(w => w + 1);
      } else {
        roundResult = 'draw';
        msg = `🤝 Draw! Both scored ${playerVal} on ${STAT_LABELS[stat]}!`;
      }

      setResult(roundResult);
      setResultMessage(msg);
      setPhase('result');
    }, 1200);
  };

  const nextRound = () => {
    if (!playerCard || !cpuCard) return;

    // Check game over conditions
    if (playerDeck.length === 0 && result === 'lose') {
      setPhase('game_over');
      return;
    }
    if (cpuDeck.length === 0 && result === 'win') {
      setPhase('game_over');
      return;
    }

    // Distribute cards based on result
    let newPlayerDeck = [...playerDeck];
    let newCpuDeck = [...cpuDeck];

    if (result === 'win') {
      newPlayerDeck = [...newPlayerDeck, playerCard, cpuCard];
    } else if (result === 'lose') {
      newCpuDeck = [...newCpuDeck, cpuCard, playerCard];
    } else {
      // Draw — each keeps their card, goes to bottom
      newPlayerDeck = [...newPlayerDeck, playerCard];
      newCpuDeck = [...newCpuDeck, cpuCard];
    }

    if (newPlayerDeck.length === 0 || newCpuDeck.length === 0) {
      setPlayerDeck(newPlayerDeck);
      setCpuDeck(newCpuDeck);
      setPhase('game_over');
      return;
    }

    const nextPlayerCard = newPlayerDeck[0];
    const nextCpuCard = newCpuDeck[0];
    setPlayerDeck(newPlayerDeck.slice(1));
    setCpuDeck(newCpuDeck.slice(1));
    setPlayerCard(nextPlayerCard);
    setCpuCard(nextCpuCard);
    setSelectedStat(null);
    setResult(null);
    setResultMessage('');
    setRoundCount(r => r + 1);
    setPhase('player_turn');
    setAnimateStats(false);
    setTimeout(() => setAnimateStats(true), 100);
  };

  const totalCards = playerDeck.length + cpuDeck.length + (playerCard ? 1 : 0) + (cpuCard ? 1 : 0);
  const playerCardCount = playerDeck.length + (playerCard ? 1 : 0);
  const cpuCardCount = cpuDeck.length + (cpuCard ? 1 : 0);

  const submitScore = trpc.leaderboard.submit.useMutation();
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitName, setSubmitName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSubmitScore = () => {
    if (!submitName.trim()) return;
    const playerWonFinal = playerCardCount > cpuCardCount;
    const isDrawFinal = playerCardCount === cpuCardCount;
    submitScore.mutate({
      playerName: submitName.trim(),
      edition: "blackbelt",
      mode: "solo",
      wins: playerWins,
      losses: cpuWins,
      draws: roundCount - playerWins - cpuWins,
      totalCards: roundCount,
    }, {
      onSuccess: () => { setScoreSubmitted(true); setShowNameInput(false); },
    });
  };

  if (phase === 'game_over') {
    const playerWon = playerCardCount > cpuCardCount;
    const isDraw = playerCardCount === cpuCardCount;

    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="tkd-card p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">
            {isDraw ? '🤝' : playerWon ? '🏆' : '💀'}
          </div>
          <h1 className="text-[#C9A84C] font-['Black_Han_Sans'] text-4xl mb-2">
            {isDraw ? 'DRAW!' : playerWon ? 'VICTORY!' : 'DEFEATED!'}
          </h1>
          <p className="text-white/60 font-['Rajdhani'] text-lg mb-6">
            {isDraw
              ? 'An honourable draw between warriors.'
              : playerWon
              ? 'You have conquered the dojo!'
              : 'The dojo master prevails. Train harder!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-[#C9A84C] font-['Bebas_Neue'] text-3xl">{playerWins}</div>
              <div className="text-white/50 font-['Rajdhani'] text-sm">Your Wins</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 font-['Bebas_Neue'] text-3xl">{roundCount}</div>
              <div className="text-white/50 font-['Rajdhani'] text-sm">Rounds</div>
            </div>
            <div className="text-center">
              <div className="text-[#E8001D] font-['Bebas_Neue'] text-3xl">{cpuWins}</div>
              <div className="text-white/50 font-['Rajdhani'] text-sm">CPU Wins</div>
            </div>
          </div>

          {/* Leaderboard submission */}
          {!scoreSubmitted ? (
            <div className="mb-6">
              {!showNameInput ? (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="w-full py-3 mb-3 border border-[#C9A84C]/40 text-[#C9A84C] font-['Black_Han_Sans'] text-base rounded-lg hover:bg-[#C9A84C]/10 transition-colors"
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
                    className="flex-1 bg-white/5 border border-[#C9A84C]/40 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C] font-['Rajdhani'] text-base"
                  />
                  <button
                    onClick={handleSubmitScore}
                    disabled={!submitName.trim() || submitScore.isPending}
                    className="px-4 py-2 bg-[#C9A84C] text-black font-['Black_Han_Sans'] text-sm rounded-lg disabled:opacity-50 transition-all"
                  >
                    {submitScore.isPending ? '...' : 'SAVE'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 text-center">
              <p className="text-[#C9A84C] font-['Rajdhani'] text-sm">✅ Score saved to leaderboard!</p>
              <button onClick={() => navigate('/leaderboard')} className="text-white/40 hover:text-white/70 font-['Rajdhani'] text-xs underline mt-1 transition-colors">View Leaderboard →</button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-lg rounded-lg hover:bg-[#FF1A35] transition-colors"
            >
              ⚔ PLAY AGAIN
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 border border-[#C9A84C]/60 text-[#C9A84C] font-['Black_Han_Sans'] text-lg rounded-lg hover:bg-[#C9A84C]/10 transition-colors"
            >
              🏠 HOME
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-[#C9A84C]/60 hover:text-[#C9A84C] font-['Rajdhani'] text-sm transition-colors flex items-center gap-1"
        >
          ← HOME
        </button>
        <div className="text-center">
          <span className="text-white/40 font-['Rajdhani'] text-xs tracking-widest">ROUND</span>
          <div className="text-[#C9A84C] font-['Bebas_Neue'] text-2xl leading-none">{roundCount}</div>
        </div>
        <button
          onClick={() => navigate("/gallery")}
          className="text-[#C9A84C]/60 hover:text-[#C9A84C] font-['Rajdhani'] text-sm transition-colors"
        >
          CARDS →
        </button>
      </div>

      {/* Score bar */}
      <div className="px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-white/60 font-['Rajdhani'] text-xs">YOU</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
              style={{ width: totalCards > 0 ? `${(playerCardCount / totalCards) * 100}%` : '50%' }}
            />
          </div>
          <span className="text-[#C9A84C] font-['Bebas_Neue'] text-lg w-8 text-right">{playerCardCount}</span>
        </div>
        <div className="text-white/30 font-['Rajdhani'] text-xs">vs</div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#E8001D] font-['Bebas_Neue'] text-lg w-8">{cpuCardCount}</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E8001D] rounded-full transition-all duration-500"
              style={{ width: totalCards > 0 ? `${(cpuCardCount / totalCards) * 100}%` : '50%' }}
            />
          </div>
          <span className="text-white/60 font-['Rajdhani'] text-xs">CPU</span>
        </div>
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {phase === 'result' && resultMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mx-4 my-2 px-4 py-3 rounded-lg text-center font-['Rajdhani'] font-semibold text-sm ${
              result === 'win'
                ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                : result === 'lose'
                ? 'bg-[#E8001D]/20 text-[#FF6B6B] border border-[#E8001D]/30'
                : 'bg-white/10 text-white/70 border border-white/20'
            }`}
          >
            {resultMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game area */}
      <div className="flex-1 px-4 py-4">
        {/* Instructions */}
        {phase === 'player_turn' && (
          <motion.p
            key="instruction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#C9A84C]/80 font-['Rajdhani'] text-sm tracking-widest mb-4 uppercase"
          >
            ⚔ Choose your best stat to battle
          </motion.p>
        )}
        {phase === 'reveal' && (
          <motion.p
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/50 font-['Rajdhani'] text-sm tracking-widest mb-4 uppercase"
          >
            Revealing opponent...
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Player card */}
          <div>
            <div className="text-center mb-2">
              <span className="text-white/50 font-['Rajdhani'] text-xs tracking-widest">YOUR CARD</span>
            </div>
            {playerCard && (
              <BlackBeltCard
                card={playerCard}
                isRevealed={true}
                selectedStat={selectedStat}
                onSelectStat={phase === 'player_turn' ? handleStatSelect : undefined}
                isPlayerCard={true}
                result={phase === 'result' ? result : null}
                animateStats={animateStats}
              />
            )}
          </div>

          {/* CPU card */}
          <div>
            <div className="text-center mb-2">
              <span className="text-white/50 font-['Rajdhani'] text-xs tracking-widest">OPPONENT</span>
            </div>
            {cpuCard && (phase === 'reveal' || phase === 'result') ? (
              <BlackBeltCard
                card={cpuCard}
                isRevealed={true}
                selectedStat={selectedStat}
                onSelectStat={undefined}
                isPlayerCard={false}
                result={phase === 'result' ? (result === 'win' ? 'lose' : result === 'lose' ? 'win' : 'draw') : null}
                animateStats={animateStats}
              />
            ) : (
              <FaceDownCard label="OPPONENT" />
            )}
          </div>
        </div>

        {/* Next round button */}
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={nextRound}
              className="px-12 py-4 bg-[#E8001D] text-white font-['Black_Han_Sans'] text-xl tracking-wider rounded-lg hover:bg-[#FF1A35] transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ boxShadow: '0 0 20px rgba(232,0,29,0.3)' }}
            >
              {playerDeck.length === 0 || cpuDeck.length === 0 ? 'FINISH' : 'NEXT ROUND ⚔'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
