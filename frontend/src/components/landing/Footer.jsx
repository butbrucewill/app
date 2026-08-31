import { IMAGES } from "@/constants";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/tradingkekhiladi/", icon: Instagram },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@TradingkeKhiladii", icon: Youtube },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61592192380913", icon: Facebook },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/trading-ke-khiladi-9b759a429/", icon: Linkedin },
  { id: "x", label: "X (Twitter)", href: "https://x.com/TradingkKhiladi", icon: Twitter },
];

const LEGAL = [
  { href: "/legal/terms", label: "Terms & Conditions", id: "terms" },
  { href: "/legal/privacy", label: "Privacy Policy", id: "privacy" },
  { href: "/legal/risk", label: "Risk Disclosure", id: "risk" },
  { href: "/legal/refund", label: "Refund & Cancellation", id: "refund" },
];

export const Footer = () => (
  <footer className="border-t border-white/10 bg-black pb-16 pt-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <img src={IMAGES.logo} alt="Trading Ke Khiladi" className="h-9 w-auto" />
          <p className="mt-5 text-xs leading-relaxed text-white/40" data-testid="footer-disclaimer">
            Trading Ke Khiladi is an entertainment event built entirely on simulated
            (paper) trading with virtual capital. No real-money trading occurs during
            the event, and no returns, profits, or outcomes are promised or
            guaranteed. Trading in real financial markets involves substantial risk
            of loss and is not suitable for everyone. Participation is subject to
            selection and the official event rules.
          </p>
        </div>

        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-white/50">Legal</p>
          <div className="mt-4 flex flex-col gap-3">
            {LEGAL.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`footer-legal-${l.id}`}
                className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-white/50">Apply</p>
          <a
            href="#apply"
            data-testid="footer-apply-btn"
            className="mt-4 inline-block bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Apply Now
          </a>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between" data-testid="footer-socials">
        <p className="font-display text-xs uppercase tracking-[0.25em] text-white/50">Follow the show</p>
        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`social-${s.id}`}
              aria-label={s.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30"
            >
              <s.icon className="h-5 w-5" strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/5 pt-6 text-xs text-white/30">
        © {new Date().getFullYear()} Trading Ke Khiladi. All rights reserved.
      </div>
    </div>
  </footer>
);
