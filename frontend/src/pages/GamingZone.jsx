import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { IMAGES } from "@/constants";

export default function GamingZone() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" data-testid="gaming-logo" className="flex items-center">
            <img src={IMAGES.logo} alt="Trading Ke Khiladi" className="h-8 w-auto" />
          </Link>
          <span className="hidden font-display text-xs uppercase tracking-[0.3em] text-white/50 sm:block">
            Gaming Zone
          </span>
          <Link
            to="/"
            data-testid="gaming-back-link"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <iframe
          src="/gaming-zone.html"
          title="Pattern Pit — Trading Ke Khiladi Gaming Zone"
          data-testid="gaming-iframe"
          className="h-full min-h-[calc(100vh-64px)] w-full border-0"
        />
      </main>
    </div>
  );
}
