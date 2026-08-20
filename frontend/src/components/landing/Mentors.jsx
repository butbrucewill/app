import { FadeIn, Eyebrow } from "./FadeIn";
import { IMAGES } from "@/constants";

const MENTORS = [
  { img: IMAGES.mentor1, role: "Trading Mentor", note: "Revealing soon" },
  { img: IMAGES.mentor2, role: "Judge & Risk Coach", note: "Revealing soon" },
];

export const Mentors = () => (
  <section id="mentors" className="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>Mentors & Judges</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          Guided by people <span className="text-primary">who trade.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          Mentors and judges live inside the villa for all 6 days — running briefings,
          reviewing trades, and scoring every challenge. The full lineup is being
          announced on our socials.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {MENTORS.map((m, i) => (
          <FadeIn key={m.role} delay={i * 0.1}>
            <div className="group relative h-96 overflow-hidden border border-white/10" data-testid={`mentor-card-${i}`}>
              <img
                src={m.img}
                alt={m.role}
                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/15" />
              <div className="absolute bottom-6 left-6">
                <div className="font-display text-2xl font-bold uppercase tracking-tight text-white">{m.role}</div>
                <div className="mt-1 inline-block bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {m.note}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
