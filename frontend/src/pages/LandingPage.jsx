import { useEffect } from "react";
import Lenis from "lenis";
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

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <Story />
      <Journey />
      <Challenges />
      <Mentors />
      <Villa />
      <Prizes />
      <ApplyForm />
      <Footer />
    </div>
  );
}
