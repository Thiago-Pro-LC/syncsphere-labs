import { MapPin, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Local Freela</h1>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/virality"
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
              pathname === "/virality"
                ? "bg-viral-accent text-viral-accent-foreground"
                : "bg-muted text-foreground hover:bg-viral-accent/20",
            )}
          >
            <Zap className="h-4 w-4" />
            Virality Predictor
          </Link>
        </nav>
      </div>
    </header>
  );
};
