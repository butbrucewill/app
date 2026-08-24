import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";
import { IMAGES } from "@/constants";
import { Crosshair, Gauge, ShieldCheck, Users } from "lucide-react";

const CARDS = [
  {
    icon: Crosshair,
    title: "Daily Market Battles",
    desc: "Timed simulated trading rounds where precision entries and exits earn your team points.",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management Trials",
    desc: "Survive engineered volatility. Blow your virtual risk limits and your team pays the price.",
    span: "",
  },
  {
    icon: Users,
    title: "Team Portfolio Wars",
    desc: "4 teams of 10 build and defend a shared virtual portfolio across multi-day challenges.",
    span: "",
  },
  {
    icon: Gauge,
    title: "Speed & Nerve Rounds",
    desc: "Rapid-fire decision games that test execution speed, discipline, and emotional control.",
    span: "md:col-span-2",
  },
];

export const Challenges = () => (
  <section id="challenges" className="relative scroll-mt-36 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Gauntlet</Eyebrow>
      </FadeIn>
      <RiseHeading
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "18–20 Games." }, { text: "One Leaderboard.", accent: true }]}
      />
      <FadeIn delay={0.15}>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          Every challenge runs on simulated (paper) trading with virtual capital — the
          pressure is real, the market risk is not.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.08} className={c.span}>
            <div
              className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-card p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50"
              data-testid={`challenge-card-${i}`}
            >
              <c.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-white group-hover:text-primary">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{c.desc}</p>
              <span className="absolute right-6 top-6 font-display text-4xl font-bold text-white/5">
                0{i + 1}
              </span>
            </div>
          </FadeIn>
        ))}
        <FadeIn delay={0.35} className="md:col-span-3">
          <div className="relative aspect-[1536/890] overflow-hidden rounded-2xl border border-white/10">
            <img src={IMAGES.challenges} alt="Trading Ke Khiladi bootcamp at the villa" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-2xl uppercase tracking-tight text-white md:text-3xl">
                The full game list drops with the show trailer
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);
