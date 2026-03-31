import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthGate from "./components/AuthGate";

// Black Belt Edition
import Home from "./pages/Home";
import Game from "./pages/Game";
import Gallery from "./pages/Gallery";
import Multiplayer from "./pages/Multiplayer";
import Purchase from "./pages/Purchase";

import Leaderboard from "./pages/Leaderboard";

// 2026 Edition
import Home2026 from "./pages/Home2026";
import Game2026 from "./pages/Game2026";
import Gallery2026 from "./pages/Gallery2026";
import Multiplayer2026 from "./pages/Multiplayer2026";
import AdminBelts from "./pages/AdminBelts";
import AdminAccess from "./pages/AdminAccess";

function Router() {
  return (
    <Switch>
      {/* ── Public pages — no login required ─────────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/purchase" component={Purchase} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/2026" component={Home2026} />

      {/* ── Protected pages — login + purchase required ───────────────────── */}
      <Route path="/game">
        <AuthGate><Game /></AuthGate>
      </Route>
      <Route path="/gallery">
        <AuthGate><Gallery /></AuthGate>
      </Route>
      <Route path="/multiplayer">
        <AuthGate><Multiplayer /></AuthGate>
      </Route>
      <Route path="/2026/game">
        <AuthGate><Game2026 /></AuthGate>
      </Route>
      <Route path="/2026/gallery">
        <AuthGate><Gallery2026 /></AuthGate>
      </Route>
      <Route path="/2026/multiplayer">
        <AuthGate><Multiplayer2026 /></AuthGate>
      </Route>

      {/* ── Admin pages — login + admin role required ─────────────────────── */}
      <Route path="/admin/belts" component={AdminBelts} />
      <Route path="/admin/access" component={AdminAccess} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
