import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

// Shared header/footer for the public blog pages (list + single post).
export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="blog-layout">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-primary">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Trading Ke <span className="text-primary">Khiladi</span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-xs font-bold uppercase tracking-widest">
            <Link to="/blog" className="text-white/70 transition-colors hover:text-white">Blog</Link>
            <Link to="/" className="text-white/70 transition-colors hover:text-white">Home</Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs leading-relaxed text-white/40 sm:px-6">
          Trading involves substantial risk of loss. Everything on this site is for education only and is not
          investment advice or a promise of returns.
        </div>
      </footer>
    </div>
  );
}