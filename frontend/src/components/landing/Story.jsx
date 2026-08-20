import { FadeIn, Eyebrow } from "./FadeIn";

export const Story = () => (
  <section id="story" className="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Show</Eyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl">
          Not a course. Not a webinar. <span className="text-primary">A battlefield.</span>
        </h2>
      </FadeIn>
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
        <FadeIn delay={0.2} className="grid grid-cols-2 gap-4">
          {[
            { k: "40", v: "Selected participants" },
            { k: "4 × 10", v: "Teams drafted on day one" },
            { k: "18–20", v: "Games & challenges" },
            { k: "₹30L", v: "Prize pool on the line" },
          ].map((s) => (
            <div key={s.v} className="border border-white/10 bg-card p-6" data-testid={`story-stat-${s.k}`}>
              <div className="font-display text-3xl font-bold text-primary">{s.k}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                {s.v}
              </div>
            </div>
          ))}
        </FadeIn>
      </div>
    </div>
  </section>
);
