import WhatCarbonCutProvides from "@/components/features-section-demo-1";
import HowItsWorkTwo from "@/components/HowItsWorkTwo";
import HowItWorksDemo from "@/components/HowItWorksDemo";
import BrandsSection from "@/components/main/BrandsSection";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";
import PreFooter from "@/components/main/PreFooter";
import WhyCarbonCut from "@/components/main/WhyCarbonCut";
import { MarqueeDemo } from "@/components/marqueeDemo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      {/* <HowItWorksDemo/> */}
      <HowItsWorkTwo/>
      <BrandsSection/>
      <WhyCarbonCut/>
      <WhatCarbonCutProvides/>
      <MarqueeDemo/>
      <PreFooter/>
      <Footer />
    </main>
  );
}
