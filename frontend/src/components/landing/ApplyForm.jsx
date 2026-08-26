import { IMAGES } from "@/constants";
import { ApplicationForm } from "@/components/ApplicationForm";
import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";

export const ApplyForm = () => (
  <section id="apply" className="relative scroll-mt-36 overflow-hidden py-20 sm:py-28">
    <div className="absolute inset-0" aria-hidden="true">
      <img
        src={IMAGES.challenges}
        alt=""
        className="h-full w-full scale-110 object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.5),#0A0A0A_78%)]" />
    </div>
    <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
      <FadeIn className="text-center">
        <Eyebrow num="07">Applications Open</Eyebrow>
      </FadeIn>
      <RiseHeading
        center
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
        lines={[{ text: "Think You're A" }, { text: "Khiladi?", accent: true }]}
      />
      <FadeIn delay={0.15} className="text-center">
        <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
          Fill this in. If you make the shortlist, our team calls you for the next
          steps. Only 40 seats exist.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <ApplicationForm />
      </FadeIn>
    </div>
  </section>
);

