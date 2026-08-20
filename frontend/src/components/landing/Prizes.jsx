import { FadeIn, Eyebrow } from "./FadeIn";
import { GraduationCap, Trophy } from "lucide-react";

export const Prizes = () => (
  <section id="prizes" className="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>What's At Stake</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          ₹30 lakh prize pool. <span className="text-primary">Free Buniyad course.</span>
        </h2>
      </FadeIn>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <FadeIn>
          <div className="relative h-full overflow-hidden border border-primary/40 bg-card p-8 sm:p-10" data-testid="prize-pool-card">
            <span className="absolute -right-4 -top-6 font-display text-[120px] font-bold leading-none text-primary/10">₹</span>
            <Trophy className="h-9 w-9 text-primary" strokeWidth={1.5} />
            <div className="mt-6 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
              ₹30,00,000
            </div>
            <div className="mt-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Total Prize Pool
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Won entirely through simulated trading performance across the week's
              games and challenges. Final prize distribution is subject to the
              official event rules shared with selected participants.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="relative h-full overflow-hidden border border-white/10 bg-card p-8 sm:p-10" data-testid="buniyad-card">
            <GraduationCap className="h-9 w-9 text-white" strokeWidth={1.5} />
            <div className="mt-6 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              Buniyad Course
            </div>
            <div className="mt-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-white/60">
              Free for every selected participant
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Every trader who makes the final 40 gets our Buniyad trading
              foundations course free — so you arrive at the villa sharp, whether
              you're a beginner or a seasoned chart reader.
            </p>
            <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">
              Registration for selected participants: <span className="font-bold text-white">₹3,00,000</span> —
              covers the full 6-day villa stay, meals, and the show experience.
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <p className="mt-8 border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-white/50" data-testid="prize-disclaimer">
          All trading in Trading Ke Khiladi is simulated (paper trading) with virtual
          capital. No real-money trading takes place during the event. Trading in
          real markets involves substantial risk of loss, and nothing on this page
          promises or guarantees any returns or outcomes.
        </p>
      </FadeIn>
    </div>
  </section>
);
