import { useEffect } from "react";
import Lenis from "lenis";
import { Ticker } from "@/components/landing/Ticker";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Story } from "@/components/landing/Story";
import { Journey } from "@/components/landing/Journey";
import { Challenges } from "@/components/landing/Challenges";
import { Mentors } from "@/components/landing/Mentors";
import { Villa } from "@/components/landing/Villa";
import { Prizes } from "@/components/landing/Prizes";
import { ApplyForm } from "@/components/landing/ApplyForm";
import { Footer } from "@/components/landing/Footer";
import { ChartDivider } from "@/components/landing/FadeIn";
import { GamingZone } from "@/components/landing/GamingZone";

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative bg-[#0A0A0A]">
      <Ticker />
      <Navbar />
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute -right-40 top-2/3 h-[440px] w-[440px] rounded-full bg-bull/[0.07] blur-[170px]" />
      </div>
      <main className="relative z-10">
        <Hero />
        <Story />
        <ChartDivider />
        <Journey />
        <Challenges />
        <GamingZone />
        <ChartDivider />
        <Mentors />
        <Villa />
        <Prizes />
        <ApplyForm />
        <Footer />
      </main>
    </div>
  );
}
