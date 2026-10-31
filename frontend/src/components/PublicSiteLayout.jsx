import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Ticker } from "@/components/landing/Ticker";

export default function PublicSiteLayout() {
  const isHome = useLocation().pathname === "/";

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white">
      {isHome && <Ticker />}
      <Navbar />
      {isHome && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="grid-bg absolute inset-0 opacity-40" />
          <div className="absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[160px]" />
          <div className="absolute -right-40 top-2/3 h-[440px] w-[440px] rounded-full bg-bull/[0.07] blur-[170px]" />
        </div>
      )}
      <main className={isHome ? "relative z-10" : "pt-16"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}