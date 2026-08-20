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

export const Eyebrow = ({ children }) => (
  <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
    {children}
  </p>
);
