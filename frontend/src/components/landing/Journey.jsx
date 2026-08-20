import { FadeIn, Eyebrow } from "./FadeIn";

const DAYS = [
  { day: "Day 1", title: "Arrival & The Draft", desc: "Check in to the villa, meet the mentors, and watch the 4 teams of 10 get drafted live." },
  { day: "Day 2", title: "Foundations Under Fire", desc: "Opening challenges test discipline, risk control, and how you handle your first drawdown." },
  { day: "Day 3", title: "Team Wars Begin", desc: "Head-to-head team battles. Strategy sessions, captain calls, and leaderboard swings." },
  { day: "Day 4", title: "Pressure Cooker", desc: "Mid-show eliminations and twist rounds. Only the calmest traders keep their edge." },
  { day: "Day 5", title: "The Semi-Finals", desc: "The highest-stakes simulated sessions of the week. Every point now decides the finale." },
  { day: "Day 6", title: "Grand Finale", desc: "The final showdown, the last leaderboard, and the crowning of the Trading Ke Khiladi." },
];

export const Journey = () => (
  <section id="journey" className="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Journey</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          6 days. <span className="text-primary">Zero mercy.</span>
        </h2>
      </FadeIn>

      <div className="mt-14 space-y-0">
        {DAYS.map((d, i) => (
          <FadeIn key={d.day} delay={i * 0.05}>
            <div className="relative border-l border-white/10 pb-10 pl-10 last:pb-0">
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,51,51,0.8)]" />
              <div className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">{d.day}</div>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-white md:text-2xl">
                {d.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">{d.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
