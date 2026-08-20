import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";
import { IMAGES } from "@/constants";

const MENTORS = [
  {
    img: IMAGES.mentorRajat,
    name: "Rajat Sharma",
    title: "Founding Director",
    desc: "Builds and leads One Stock Academy's trading community, translating market moves into content.",
    tag: "150K+ on Instagram",
    pos: "object-top",
  },
  {
    img: IMAGES.mentorAman,
    name: "Aman Singh Negi",
    title: "Chief Academic Officer",
    desc: "Leads the online cohort experience, known for breaking down price action and market structure for beginners.",
    tag: "750K+ on Instagram",
    pos: "object-center",
  },
  {
    img: IMAGES.mentorDesk,
    name: "Rishabh Mishra",
    title: "Founding Director",
    desc: "SEBI-registered trader and the driving force behind One Stock Academy's curriculum and mentorship philosophy. Leads flagship live sessions and 1:1.",
    tag: "SEBI Registered",
    pos: "object-top",
  },
];

export const Mentors = () => (
  <section id="mentors" className="relative scroll-mt-36 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Faculty</Eyebrow>
      </FadeIn>
      <RiseHeading
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "Meet The" }, { text: "Mentors", accent: true }]}
      />
      <FadeIn delay={0.15}>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          Mentors and judges live inside the villa for all 6 days — running briefings,
          reviewing trades, and scoring every challenge.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MENTORS.map((m, i) => (
          <FadeIn key={m.name + i} delay={i * 0.1}>
            <article
              className="group relative h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-card sm:h-[540px]"
              data-testid={`mentor-card-${i}`}
            >
              <img
                src={m.img}
                alt={m.name}
                loading="lazy"
                className={`h-full w-full object-cover ${m.pos} transition-transform duration-[1.2s] ease-out group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,7,0.96),rgba(7,7,7,0.15)_58%)]" />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />
              <div className="glass absolute right-5 top-5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bull">
                {m.tag}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-3xl uppercase tracking-tight text-white">{m.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">{m.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{m.desc}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
