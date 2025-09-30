import {testimonialsData } from "@/components/data/testimonials";
import WhatCarbonCutProvides from "@/components/features-section-demo-1";
import HowItsWorkTwo from "@/components/HowItsWorkTwo";
import HowItWorks from "@/components/HowItWorksDemo";
import BrandsSection from "@/components/main/BrandsSection";
import CarbonCutImpact from "@/components/main/CarbonCutImpact";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";
import PreFooter from "@/components/main/PreFooter";
import WhyCarbonCut from "@/components/main/WhyCarbonCut";
import { MarqueeDemo } from "@/components/marqueeDemo";
import TestimonialCarousel from "@/components/Testimonials";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      {/* <HowItsWorkTwo/> */}
      <HowItWorks/>
      <BrandsSection/>
      <MarqueeDemo/>
      <WhyCarbonCut/>
      <CarbonCutImpact/>
      <WhatCarbonCutProvides/>
      <TestimonialCarousel testimonials={testimonialsData} autoAdvanceMs={4000}/>
      <PreFooter/>
      <Footer />
    </main>
  );
}
