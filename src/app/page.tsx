import WhatCarbonCutProvides from "@/components/features-section-demo-1";
import HowItsWorkTwo from "@/components/HowItsWorkTwo";
import BrandsSection from "@/components/main/BrandsSection";
import CarbonCutImpact from "@/components/main/CarbonCutImpact";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";
import PreFooter from "@/components/main/PreFooter";
import WhyCarbonCut from "@/components/main/WhyCarbonCut";
import { MarqueeDemo } from "@/components/marqueeDemo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      <HowItsWorkTwo/>
      <BrandsSection/>
      <MarqueeDemo/>
      <WhyCarbonCut/>
      <CarbonCutImpact/>
      <WhatCarbonCutProvides/>
      <PreFooter/>
      <Footer />
    </main>
  );
}
