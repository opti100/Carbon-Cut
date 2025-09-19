import WhatCarbonCutProvides from "@/components/features-section-demo-1";
import HowItWorksDemo from "@/components/HowItWorksDemo";
import BrandsSection from "@/components/main/BrandsSection";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      <HowItWorksDemo/>
      <BrandsSection/>
      <WhatCarbonCutProvides/>
      <Footer />
    </main>
  );
}
