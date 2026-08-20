import { FadeIn, Eyebrow } from "./FadeIn";
import { IMAGES } from "@/constants";
import { BedDouble, MapPin, Wifi } from "lucide-react";

export const Villa = () => (
  <section id="villa" className="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Villa</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          6 days in a <span className="text-primary">Thailand villa resort.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          This is not a conference hall. Private villa resort, pool-side war rooms,
          live leaderboard screens, and every meal and stay covered for selected
          participants.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-5">
        <FadeIn className="md:col-span-3">
          <div className="relative h-72 overflow-hidden border border-white/10 md:h-[420px]">
            <img src={IMAGES.villa1} alt="Luxury villa resort pool in Thailand" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Thailand Villa Resort
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="md:col-span-2">
          <div className="relative h-72 overflow-hidden border border-white/10 md:h-[420px]">
            <img src={IMAGES.villa2} alt="Resort interiors" className="h-full w-full object-cover" />
          </div>
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BedDouble, label: "Stay & meals covered for all 6 days" },
          { icon: Wifi, label: "Pro trading floor setup with live leaderboards" },
          { icon: MapPin, label: "Shot on location — you are inside the show" },
        ].map((f, i) => (
          <FadeIn key={f.label} delay={i * 0.08}>
            <div className="flex items-center gap-4 border border-white/10 bg-card p-5">
              <f.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-medium text-white/80">{f.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
