import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";
import { IMAGES } from "@/constants";
import { BedDouble, MapPin, Wifi } from "lucide-react";

export const Villa = () => (
  <section id="villa" className="relative scroll-mt-36 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <FadeIn>
        <Eyebrow>The Villa</Eyebrow>
      </FadeIn>
      <RiseHeading
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "6 Days In A" }, { text: "Thailand Villa Resort.", accent: true }]}
      />
      <FadeIn delay={0.15}>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          This is not a conference hall. Private villa resort, pool-side war rooms,
          live leaderboard screens, and every meal and stay covered for selected
          participants.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-5">
        <FadeIn className="md:col-span-3">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 md:h-[420px]">
            <img src={IMAGES.villa1} alt="Luxury villa resort pool in Thailand" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Thailand Villa Resort
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="md:col-span-2">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 md:h-[420px]">
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
            <div className="glass flex items-center gap-4 rounded-xl p-5">
              <f.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-medium text-white/80">{f.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
