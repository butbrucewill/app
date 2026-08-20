import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";
import { Check, GraduationCap, Trophy } from "lucide-react";

const FEE_INCLUDES = [
  "6-day Thailand villa stay & all meals",
  "18–20 simulated trading games & challenges",
  "Buniyad trading foundations course — free",
  "Live mentorship, judging & the show experience",
];

export const Prizes = () => (
  <section id="prizes" className="relative scroll-mt-36 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>What's At Stake</Eyebrow>
      </FadeIn>
      <RiseHeading
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "₹30 Lakh Prize Pool." }, { text: "Buniyad Included.", accent: true }]}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <FadeIn>
          <div
            className="glass group relative h-full overflow-hidden rounded-3xl border-primary/30 p-8 transition-transform duration-500 hover:-translate-y-2 sm:p-10"
            data-testid="prize-pool-card"
          >
            <span className="absolute -right-4 -top-10 font-display text-[140px] leading-none text-primary/10">₹</span>
            <Trophy className="h-9 w-9 text-primary" strokeWidth={1.5} />
            <div className="mt-6 font-display text-5xl tracking-tight text-white sm:text-6xl">
              ₹30,00,000
            </div>
            <div className="mt-2 font-display text-sm uppercase tracking-[0.25em] text-primary">
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
          <div
            className="glass group relative h-full overflow-hidden rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2 sm:p-10"
            data-testid="buniyad-card"
          >
            <GraduationCap className="h-9 w-9 text-bull" strokeWidth={1.5} />
            <div className="mt-6 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Buniyad Course
            </div>
            <div className="mt-2 font-display text-sm uppercase tracking-[0.25em] text-bull">
              Free with the participation fee
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              The Buniyad trading foundations course comes bundled with your
              participation fee — every confirmed participant gets it free, so you
              arrive at the villa sharp whether you're a beginner or a seasoned
              chart reader.
            </p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="font-display text-2xl tracking-wide text-white">
                ₹3,00,000{" "}
                <span className="text-sm uppercase tracking-widest text-white/50">
                  participation fee — includes
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {FEE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="h-4 w-4 shrink-0 text-bull" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <p className="glass mt-8 rounded-2xl p-5 text-xs leading-relaxed text-white/50" data-testid="prize-disclaimer">
          All trading in Trading Ke Khiladi is simulated (paper trading) with virtual
          capital. No real-money trading takes place during the event. Trading in
          real markets involves substantial risk of loss, and nothing on this page
          promises or guarantees any returns or outcomes.
        </p>
      </FadeIn>
    </div>
  </section>
);
