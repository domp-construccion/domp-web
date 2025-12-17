import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import WhySection from "@/components/WhySection";
import CTA from "@/components/CTA";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <WhySection />
      <CTA />
    </>
  );
}

