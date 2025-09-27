import WhatCarbonCutProvides from "@/components/features-section-demo-1";
import HowItsWorkTwo from "@/components/HowItsWorkTwo";
import HowItWorksDemo from "@/components/HowItWorksDemo";
import { BackgroundPaths } from "@/components/main/background-paths";
import BrandsSection from "@/components/main/BrandsSection";
import CarbonCutImpact from "@/components/main/CarbonCutImpact";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";
import OurSolutions from "@/components/main/OurSolutions";
import PreFooter from "@/components/main/PreFooter";
import ProvenProcess from "@/components/main/ProvenProcess";
import WhyCarbonCut from "@/components/main/WhyCarbonCut";
import { MarqueeDemo } from "@/components/marqueeDemo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      {/* <BackgroundPaths title="How it Works"/> */}
      <HowItsWorkTwo/>
      <BrandsSection/>
      <MarqueeDemo/>
      <WhyCarbonCut/>
      <ProvenProcess/>
      <CarbonCutImpact/>
      <WhatCarbonCutProvides/>
      <PreFooter/>
      <Footer />
    </main>
  );
}
