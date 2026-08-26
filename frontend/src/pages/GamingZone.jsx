import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { IMAGES } from "@/constants";
import { ApplicationForm } from "@/components/ApplicationForm";

export default function GamingZone() {
  const [player, setPlayer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tkk_player") || "null");
    } catch {
      return null;
    }
  });

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

      {player ? (
        <main className="flex-1" data-testid="gaming-unlocked">
          <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-center text-xs uppercase tracking-widest text-white/60">
            Playing as <span className="font-bold text-primary">{player.name}</span> — every round is scored to your application
          </div>
          <iframe
            src="/gaming-zone.html"
            title="Pattern Pit — Trading Ke Khiladi Gaming Zone"
            data-testid="gaming-iframe"
            className="h-full min-h-[calc(100vh-100px)] w-full border-0"
          />
        </main>
      ) : (
        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0" aria-hidden="true">
            <img src={IMAGES.challenges} alt="" className="h-full w-full scale-110 object-cover opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.55),#0A0A0A_80%)]" />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20" data-testid="gaming-gate">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
                <Gamepad2 className="h-3.5 w-3.5" />
                Trading Ke Khiladi · Gaming Zone
              </span>
              <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
                Want to <span className="text-primary">Play?</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                Fill the application below — the moment you submit, Pattern Pit
                unlocks right here. One application, unlimited rounds, and every
                score lands on the organizer's leaderboard.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <ApplicationForm
                onSuccess={(p) => {
                  toast.success("You're in! Game unlocked.");
                  setPlayer(p);
                }}
              />
            </motion.div>
          </div>
        </main>
      )}
    </div>
  );
}
