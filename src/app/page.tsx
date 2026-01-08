'use client'

import CardNav from '@/components/CardNav'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Blogs from '@/components/main/Blogs'
import Core from '@/components/main/Core'
import FeatureSection from '@/components/main/FeaturSection'
import Footer from '@/components/main/Footer'
import Hero from '@/components/main/Hero'
import HowItWorks from '@/components/main/HowItWorks'
import { ImpactSection } from '@/components/main/Impact'
import PreFooter from '@/components/main/PreFooter'
import Standards from '@/components/main/Standards'
import TrustedBySection from '@/components/main/TrustedBySection'
import { navData } from '@/components/NavData'

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
  )
}
