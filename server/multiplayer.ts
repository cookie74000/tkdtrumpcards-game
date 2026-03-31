// TKD Top Trumps — Multiplayer Socket.io Server
// Handles room creation, joining, and real-time game state sync

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { BlackBelt, StatKey } from "../client/src/lib/blackbelts";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Player {
  socketId: string;
  name: string;
  deck: BlackBelt[];
  ready: boolean;
}

interface Room {
  id: string;
  players: Player[];
  gameStarted: boolean;
  round: number;
  currentTurn: "p1" | "p2"; // whose turn to pick a stat
  createdAt: number;
}

// ── In-memory room store ───────────────────────────────────────────────────────

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  // Ensure uniqueness
  return rooms.has(code) ? generateRoomCode() : code;
}

function shuffleDeck(deck: BlackBelt[]): BlackBelt[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

// Clean up empty/stale rooms every 10 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rooms.entries()).forEach(([id, room]) => {
    if (now - room.createdAt > 60 * 60 * 1000) {
      rooms.delete(id);
    }
  });
}, 10 * 60 * 1000);

// ── Socket.io setup ────────────────────────────────────────────────────────────

export function setupMultiplayer(httpServer: HttpServer, allCards: BlackBelt[]) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    path: "/api/socket.io",
  });

  io.on("connection", (socket) => {
    console.log(`[MP] Connected: ${socket.id}`);

    // ── Create Room ──────────────────────────────────────────────────────────
    socket.on("create_room", ({ playerName }: { playerName: string }) => {
      const roomId = generateRoomCode();
      const room: Room = {
        id: roomId,
        players: [{ socketId: socket.id, name: playerName, deck: [], ready: false }],
        gameStarted: false,
        round: 1,
        currentTurn: "p1",
        createdAt: Date.now(),
      };
      rooms.set(roomId, room);
      socket.join(roomId);
      socket.emit("room_created", { roomId });
      console.log(`[MP] Room ${roomId} created by ${playerName}`);
    });

    // ── Join Room ────────────────────────────────────────────────────────────
    socket.on("join_room", ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      const room = rooms.get(roomId.toUpperCase());
      if (!room) {
        socket.emit("error", { message: "Room not found. Check the code and try again." });
        return;
      }
      if (room.players.length >= 2) {
        socket.emit("error", { message: "Room is full — game already has 2 players." });
        return;
      }
      if (room.gameStarted) {
        socket.emit("error", { message: "Game already in progress." });
        return;
      }
      room.players.push({ socketId: socket.id, name: playerName, deck: [], ready: false });
      socket.join(roomId.toUpperCase());

      // Notify both players
      socket.emit("room_joined", { roomId: roomId.toUpperCase(), playerIndex: 1 });
      io.to(roomId.toUpperCase()).emit("player_joined", {
        players: room.players.map((p) => ({ name: p.name })),
      });
      console.log(`[MP] ${playerName} joined room ${roomId}`);
    });

    // ── Start Game ───────────────────────────────────────────────────────────
    socket.on("start_game", ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room || room.players.length < 2) return;

      // Shuffle and split the deck evenly
      const shuffled = shuffleDeck([...allCards]);
      const half = Math.floor(shuffled.length / 2);
      room.players[0]!.deck = shuffled.slice(0, half);
      room.players[1]!.deck = shuffled.slice(half);
      room.gameStarted = true;
      room.round = 1;
      room.currentTurn = "p1";

      // Send each player their own deck (hidden from opponent)
      room.players.forEach((player, idx) => {
        io.to(player.socketId).emit("game_started", {
          myDeck: player.deck,
          myIndex: idx,
          opponentName: room.players[idx === 0 ? 1 : 0]!.name,
          opponentDeckSize: room.players[idx === 0 ? 1 : 0]!.deck.length,
          currentTurn: room.currentTurn,
          round: room.round,
        });
      });
      console.log(`[MP] Game started in room ${roomId}`);
    });

    // ── Play Stat (pick a category) ──────────────────────────────────────────
    socket.on(
      "play_stat",
      ({ roomId, stat }: { roomId: string; stat: StatKey }) => {
        const room = rooms.get(roomId);
        if (!room || !room.gameStarted) return;

        const p1 = room.players[0]!;
        const p2 = room.players[1]!;
        const activePlayer = room.currentTurn === "p1" ? p1 : p2;

        // Only the active player can pick
        if (socket.id !== activePlayer.socketId) return;

        const card1 = p1.deck[0]!;
        const card2 = p2.deck[0]!;

        const val1 = card1[stat] as number;
        const val2 = card2[stat] as number;

        let winner: "p1" | "p2" | "draw";
        if (val1 > val2) winner = "p1";
        else if (val2 > val1) winner = "p2";
        else winner = "draw";

        // Move cards
        if (winner === "p1") {
          p1.deck.push(p1.deck.shift()!, p2.deck.shift()!);
        } else if (winner === "p2") {
          p2.deck.push(p2.deck.shift()!, p1.deck.shift()!);
        } else {
          // Draw — each keeps their own card, rotate to bottom
          p1.deck.push(p1.deck.shift()!);
          p2.deck.push(p2.deck.shift()!);
        }

        room.round++;
        // Winner picks next, or keep same on draw
        if (winner !== "draw") {
          room.currentTurn = winner;
        }

        // Check game over
        const gameOver = p1.deck.length === 0 || p2.deck.length === 0;
        const gameWinner = p1.deck.length === 0 ? "p2" : p2.deck.length === 0 ? "p1" : null;

        const roundResult = {
          stat,
          card1,
          card2,
          val1,
          val2,
          winner,
          p1DeckSize: p1.deck.length,
          p2DeckSize: p2.deck.length,
          round: room.round,
          currentTurn: room.currentTurn,
          gameOver,
          gameWinner,
          gameWinnerName: gameWinner ? room.players[gameWinner === "p1" ? 0 : 1]!.name : null,
        };

        io.to(roomId).emit("round_result", roundResult);

        if (gameOver) {
          rooms.delete(roomId);
          console.log(`[MP] Game over in room ${roomId} — winner: ${gameWinner}`);
        }
      }
    );

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      Array.from(rooms.entries()).forEach(([roomId, room]) => {
        const idx = room.players.findIndex((p: Player) => p.socketId === socket.id);
        if (idx !== -1) {
          io.to(roomId).emit("opponent_disconnected", {
            message: `${room.players[idx]!.name} has disconnected.`,
          });
          rooms.delete(roomId);
        }
      });
      console.log(`[MP] Disconnected: ${socket.id}`);
    });
  });

  return io;
}
