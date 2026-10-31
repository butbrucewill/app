import { useEffect } from "react";
import Lenis from "lenis";
import { Hero } from "@/components/landing/Hero";
import { EditorialMarquee } from "@/components/landing/EditorialMarquee";
import { Story } from "@/components/landing/Story";
import { Journey } from "@/components/landing/Journey";
import { Challenges } from "@/components/landing/Challenges";
import { Mentors } from "@/components/landing/Mentors";
import { Villa } from "@/components/landing/Villa";
import { Prizes } from "@/components/landing/Prizes";
import { ApplyForm } from "@/components/landing/ApplyForm";
import { ChartDivider } from "@/components/landing/FadeIn";

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Hero />
      <EditorialMarquee />
      <Story />
      <ChartDivider />
      <Journey />
      <Challenges />
      <ChartDivider />
      <Mentors />
      <Villa />
      <Prizes />
      <EditorialMarquee />
      <ApplyForm />
    </>
  );
}
