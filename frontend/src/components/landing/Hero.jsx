import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EVENT_DATE, IMAGES } from "@/constants";

function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

const MaskedLine = ({ text, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block will-change-transform"
      initial={{ y: "115%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  </span>
);

const STATS = [
  { value: "40", label: "Participants" },
  { value: "4 × 10", label: "Teams Drafted" },
  { value: "₹30L", label: "Prize Pool" },
  { value: "6", label: "Days in Thailand" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export const Hero = () => {
  const t = useCountdown(EVENT_DATE);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Mins", value: t.minutes },
    { label: "Secs", value: t.seconds },
  ];

  return (
    <section ref={ref} id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={IMAGES.hero} alt="" className="h-full w-full scale-110 object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,7,7,0.82),rgba(7,7,7,0.55)_38%,#0A0A0A)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_5%,rgba(7,7,7,0.75)_75%)]" />
      </motion.div>

      <motion.div
        style={{ opacity: contentFade }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-40 text-center sm:px-6"
      >
        <motion.div {...fadeUp(0)}>
          <span
            data-testid="hero-badge"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] uppercase tracking-[0.35em] text-white/60 backdrop-blur-md sm:text-xs"
          >
            <span className="pulse-trade h-1.5 w-1.5 rounded-full bg-bull" />
            Season 01 · Applications Open
          </span>
        </motion.div>

        <div className="mt-10 overflow-hidden">
          <motion.img
            src={IMAGES.logo}
            alt="Trading Ke Khiladi"
            data-testid="hero-logo"
            initial={{ clipPath: "inset(100% 0 0 0)", y: 60, scale: 0.96 }}
            animate={{ clipPath: "inset(0% 0 0 0)", y: 0, scale: 1 }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(88vw,660px)] drop-shadow-[0_0_80px_rgba(255,31,61,0.35)] will-change-transform"
          />
        </div>
        <h1 className="sr-only">Trading Ke Khiladi — India's Biggest Simulated Trading Reality Show</h1>

        <p
          data-testid="hero-headline"
          className="mt-8 max-w-2xl text-balance font-display text-2xl uppercase leading-[1.05] tracking-wide text-white sm:text-4xl"
        >
          <MaskedLine text="India's Biggest Trading Reality Show" delay={1.0} />
          <MaskedLine text="& Luxury Villa Experience" delay={1.15} className="text-primary" />
        </p>

        <motion.p {...fadeUp(1.35)} className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Learn from top trading mentors. 40 traders, 4 teams of 10, 6 days inside a
          luxury Thailand villa — competing in 18–20 simulated trading challenges for
          a ₹30 lakh prize pool.
        </motion.p>

        <motion.div {...fadeUp(1.5)} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#apply"
            data-testid="hero-apply-btn"
            className="btn-gradient glow-red group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-shadow duration-500 hover:shadow-[0_0_60px_-10px_#FF3333]"
          >
            Apply Now
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </a>
          <a
            href="#story"
            data-testid="hero-explore-btn"
            className="glass group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-500 hover:border-bull/40"
          >
            Explore the Show
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </a>
        </motion.div>

        <motion.div
          {...fadeUp(1.65)}
          data-testid="hero-countdown"
          className="glass mt-12 flex items-center gap-5 rounded-2xl px-6 py-4 sm:gap-8 sm:px-10"
        >
          <span className="hidden text-left text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/40 sm:block">
            Applications
            <br />
            close in
          </span>
          {units.map((u) => (
            <div key={u.label} className="text-center">
              <div className="font-display text-2xl tracking-wide text-white sm:text-4xl">
                {String(u.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50 sm:text-[10px]">
                {u.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p {...fadeUp(1.75)} className="mt-6 max-w-lg text-[11px] leading-relaxed text-white/40">
          All trading in the show is simulated (paper trading) with virtual capital.
          No real-money trading. No guaranteed outcomes.
        </motion.p>

        <div className="mt-14 grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp(1.85 + i * 0.1)}
              data-testid={`hero-stat-${i}`}
              className="glass group rounded-2xl p-4 transition-transform duration-500 hover:-translate-y-1.5 sm:p-6"
            >
              <div className="font-display text-3xl tracking-wide text-white transition-colors duration-300 group-hover:text-primary sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-white/50 sm:text-xs">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
