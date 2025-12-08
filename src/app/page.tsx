import { MarqueeDemo } from "@/components/marqueeDemo";
import Blogs from "@/components/NewLanding/Blogs";
import Core from "@/components/NewLanding/Core";
import FeatureSection from "@/components/NewLanding/FeaturSection";
import Footer from "@/components/NewLanding/Footer";
import Hero from "@/components/NewLanding/Hero";
import HowItWorks from "@/components/NewLanding/HowItWorks";
import ImpactSection from "@/components/NewLanding/Impact";
import Navbar from "@/components/NewLanding/Navbar";
import PreFooter from "@/components/NewLanding/PreFooter";
import Standards from "@/components/NewLanding/Standards";
import TrustedBySection from "@/components/NewLanding/TrustedBySection";



export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Hero/>
      <HowItWorks/>
      <BrandsSection/> 
      <WhyCarbonCut/>
      <CarbonCutImpact/>
      <WhatCarbonCutProvides/>
      <PreFooter/>
      <Footer /> */}


  <div className="relative min-h-screen w-full">
         <Navbar />
        
         {/* ✅ Each section must be wrapped in data-scroll-section */}
         <div data-scroll-section>
           <Hero />
          
         </div>


         <div data-scroll-section>
           <Standards />
         </div>

       

         <div data-scroll-section>
           <HowItWorks />
         </div>

     <div data-scroll-section> 
       <TrustedBySection />
     </div>

     <div data-scroll-section>
        <Core />
     </div>

{/* staks  */}
       {/* <div data-scroll-section>
           <Stacking />
         </div> */}

         <div data-scroll-section>
          <ImpactSection />
         </div>

     <div data-scroll-section>
            <FeatureSection />
     </div>

     <div data-scroll-section>
       <Blogs />
        </div>

     <div data-scroll-section>
       <PreFooter />
     </div>

     <div data-scroll-section>
         <Footer />
       </div>
      </div>
      
      
    </main>
  );
}
