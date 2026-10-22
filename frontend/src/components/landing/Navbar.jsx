import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { IMAGES } from "@/constants";

const LINKS = [
  { href: "#story", label: "The Show" },
  { href: "#journey", label: "Journey" },
  { href: "#challenges", label: "Challenges" },
  { href: "/gamingzone", label: "Gaming Zone" },
  { href: "#mentors", label: "Mentors" },
  { href: "#villa", label: "The Villa" },
  { href: "#prizes", label: "Prizes" },
  { href: "/blog", label: "Blog" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-3 top-11 z-50 mx-auto max-w-6xl rounded-full border border-white/10 bg-black/60 backdrop-blur-xl sm:inset-x-6">
        <nav className="flex h-14 items-center justify-between px-4 sm:px-6">
          <a href="#top" data-testid="nav-logo" className="flex items-center">
            <img src={IMAGES.logo} alt="Trading Ke Khiladi" className="h-7 w-auto sm:h-8" />
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#apply"
              data-testid="nav-apply-btn"
              className="btn-gradient glow-red hidden items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_0_50px_-8px_#FF3333] sm:inline-flex"
            >
              Apply Now
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <button
              data-testid="nav-mobile-menu-btn"
              onClick={() => setOpen(!open)}
              className="text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-x-3 top-[108px] z-50 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl lg:hidden"
          data-testid="nav-mobile-menu"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#apply"
            data-testid="nav-mobile-apply-btn"
            onClick={() => setOpen(false)}
            className="btn-gradient mt-2 block rounded-full px-5 py-3 text-center font-display text-sm uppercase tracking-widest text-white"
          >
            Apply Now
          </a>
        </div>
      )}
    </>
  );
};