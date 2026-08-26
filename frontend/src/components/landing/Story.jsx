import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";
import { Trophy } from "lucide-react";

export const Story = () => (
  <section id="story" className="relative scroll-mt-36 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow num="01">What Is It</Eyebrow>
      </FadeIn>
      <RiseHeading
        className="mt-6 max-w-3xl font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "Not a course. Not a webinar." }, { text: "A battlefield.", accent: true }]}
      />
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <FadeIn delay={0.1}>
          <p className="text-base leading-relaxed text-white/70 md:text-lg">
            Trading Ke Khiladi takes 40 selected traders out of their screens and drops
            them into a luxury villa resort in Thailand for 6 days. Split into 4 teams
            of 10, they face a relentless schedule of 18–20 trading games and
            challenges — every trade simulated, every point earned under pressure.
          </p>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Cameras roll. Mentors push. Teams rise and fall on the leaderboard. At the
            end, one team walks away with the title — and a share of the ₹30 lakh
            prize pool.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 gap-4">
          {[
            { k: "40", v: "Selected participants" },
            { k: "4 × 10", v: "Teams drafted on day one" },
            { k: "18–20", v: "Games & challenges" },
            { k: "₹30L", v: "Prize pool on the line" },
          ].map((s, i) => (
            <FadeIn key={s.v} delay={0.2 + i * 0.08}>
              <div
                className={`glass rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1.5 ${i % 2 === 0 ? "float-slow" : ""}`}
                data-testid={`story-stat-${s.k}`}
              >
                <div className="font-display text-4xl text-primary">{s.k}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                  {s.v}
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn delay={0.5} className="col-span-2">
            <div className="glass float-slow flex items-center gap-4 rounded-2xl p-5" data-testid="story-leaderboard-card">
              <Trophy className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-white/70">
                Ranked every session on P&amp;L, risk and discipline — the leaderboard
                updates live inside the villa.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>
);
