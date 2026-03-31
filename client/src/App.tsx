import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Black Belt Edition
import Home from "./pages/Home";
import Game from "./pages/Game";
import Gallery from "./pages/Gallery";
import Multiplayer from "./pages/Multiplayer";
import Purchase from "./pages/Purchase";

// 2026 Edition
import Home2026 from "./pages/Home2026";
import Game2026 from "./pages/Game2026";
import Gallery2026 from "./pages/Gallery2026";
import Multiplayer2026 from "./pages/Multiplayer2026";

function Router() {
  return (
    <Switch>
      {/* Black Belt Edition */}
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/multiplayer" component={Multiplayer} />
      <Route path="/purchase" component={Purchase} />

      {/* 2026 Edition */}
      <Route path="/2026" component={Home2026} />
      <Route path="/2026/game" component={Game2026} />
      <Route path="/2026/gallery" component={Gallery2026} />
      <Route path="/2026/multiplayer" component={Multiplayer2026} />

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
