import { useId } from "react";
import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, num }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
    <span className="pulse-trade h-1.5 w-1.5 rounded-full bg-primary" />
    {num && <span className="font-display text-sm tracking-widest text-white/70">{num}</span>}
    {children}
  </span>
);

export const RiseHeading = ({ lines, className = "", center = false }) => (
  <h2 className={className}>
    {lines.map((line, li) => (
      <motion.span
        key={li}
        className={`flex flex-wrap gap-x-[0.28em] ${center ? "justify-center" : ""} ${
          line.accent ? "text-primary" : ""
        }`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07, delayChildren: li * 0.12 } },
        }}
      >
        {line.text.split(" ").map((w, wi) => (
          <span key={wi} className="overflow-hidden py-[0.08em]">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    ))}
  </h2>
);

export const ChartDivider = () => {
  const id = useId();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6" aria-hidden="true">
      <svg viewBox="0 0 1200 40" className="h-10 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="#FF3333" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 30 L180 30 L215 12 L250 34 L290 20 L340 28 L420 8 L470 32 L520 22 L600 26 L700 14 L760 30 L840 18 L900 30 L1000 24 L1060 34 L1200 26"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="1.4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};
