import { useState } from "react";
import { Flame, Menu, X } from "lucide-react";

const LINKS = [
  { href: "#story", label: "The Show" },
  { href: "#journey", label: "Journey" },
  { href: "#challenges", label: "Challenges" },
  { href: "#mentors", label: "Mentors" },
  { href: "#villa", label: "The Villa" },
  { href: "#prizes", label: "Prizes" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center bg-primary">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Trading <span className="text-primary">Ke</span> Khiladi
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-semibold uppercase tracking-widest text-white/60 transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#apply"
            data-testid="nav-apply-btn"
            className="hidden bg-primary px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 sm:inline-block"
          >
            Apply Now
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

      {open && (
        <div className="border-t border-white/10 bg-black/90 px-4 py-4 backdrop-blur-xl lg:hidden" data-testid="nav-mobile-menu">
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
            className="mt-2 block bg-primary px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-widest text-white"
          >
            Apply Now
          </a>
        </div>
      )}
    </header>
  );
};
