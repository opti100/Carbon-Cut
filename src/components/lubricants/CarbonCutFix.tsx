'use client'
import { StickyScroll } from '../ui/sticky-scroll-reveal'
import UniversalHeading from '../UniversalHeading'

const DATA = [
  {
    title: 'Base oil extraction',
    description: 'Crude sourcing, refinery energy consumption',
  },
  {
    title: 'Additives & blends',
    description: 'Chemical inventory & sourcing emissions',
  },
  {
    title: 'Manufacturing',
    description: 'Blending, bottling, energy mix, utilities',
  },
  {
    title: 'Packaging',
    description: 'Container materials, recycling %, suppliers',
  },
  {
    title: 'Logistics',
    description: 'Fleet type, fuel, distance, warehousing',
  },
  {
    title: 'Distribution',
    description: 'Port → distributor → retailer emissions',
  },
  {
    title: 'End-use emissions',
    description: 'Lubricant performance vs lifecycle',
  },
]

export function CarbonCutFix() {
  return (
    <>
      <div className="max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto py-20">
        <UniversalHeading
          title="Built for the Entire Digital Ecosystem"
          description="Whether you're disrupting finance or revolutionising entertainment, we understand your business:"
          align="right"
        />

        <div className="w-full bg-[#fcfdf6]">
          <StickyScroll content={DATA} />
        </div>
      </div>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
    </>
  )
}
