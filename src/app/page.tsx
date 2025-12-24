"use client"
import { MarqueeDemo } from "@/components/marqueeDemo";
import Blogs from "@/components/NewLanding/Blogs";
import Core from "@/components/NewLanding/Core";
import FeatureSection from "@/components/NewLanding/FeaturSection";
import Footer from "@/components/NewLanding/Footer";
import Hero from "@/components/NewLanding/Hero";
import HowItWorks from "@/components/NewLanding/HowItWorks";
import CardNav from "@/components/CardNav";
import PreFooter from "@/components/NewLanding/PreFooter";
import Standards from "@/components/NewLanding/Standards";
import TrustedBySection from "@/components/NewLanding/TrustedBySection";
import { CardNavItem } from "@/components/CardNav";
import LenisSmoothScroll from "@/components/LenisSmoothScroll";
import { navData } from "@/components/NavData";
import { ImpactSection } from "@/components/NewLanding/Impact";


export default function Home() {
    return (
        <LenisSmoothScroll>
            <main className="min-h-screen">
                <div className="relative min-h-screen w-full">
                    <CardNav
                        logo="/CarbonCut-fe/CC.svg"
                        logoAlt="CarbonCut Logo"
                        items={navData}
                        baseColor="rgba(255, 255, 255, 0.1)"
                        menuColor="#ffffff"
                        buttonBgColor="#b0ea1d"
                        buttonTextColor="#080c04"
                    />

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
        </LenisSmoothScroll>
    );
}