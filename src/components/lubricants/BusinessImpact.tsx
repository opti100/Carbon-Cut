'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import UniversalHeading from '../UniversalHeading'

const features = [
  {
    title: 'Reduce carbon taxes by up to 17%',
    image: '/lubricants/BusinessImpact/Reduce-Carbon.png',
  },
  {
    title: ' Low cost, low effort activity ',
    image: '/lubricants/BusinessImpact/Low-Cost.png',
  },
  {
    title: 'Double your accuracy and quality of CO2e reporting',
    image: '/lubricants/BusinessImpact/Double-accuracy.png',
  },
  {
    title: 'Win ESG-driven tenders',
    image: '/lubricants/BusinessImpact/ESG-driven-tenders.png',
  },
  {
    title: 'Increase stakeholder confidence',
    image: '/lubricants/BusinessImpact/Stakeholder-Confidence.png',
  },
  {
    title: 'Improve supply chain transparency',
    image: '/lubricants/BusinessImpact/Supply-chain.png',
  },
  {
    title: ' Eliminate manual carbon reporting',
    image: '/lubricants/BusinessImpact/Manual-Carbon-Reporting.png',
  },
  {
    title: 'Track progress toward Net-Zero 2030/2050',
    image: '/lubricants/BusinessImpact/Net-Zero.png',
  },
]

export default function BusinessImpact() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4,
      spacing: 16,
    },
    breakpoints: {
      '(max-width: 1024px)': {
        slides: { perView: 2.2, spacing: 12 },
      },
      '(max-width: 640px)': {
        slides: { perView: 1.2, spacing: 12 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  return (
    <section className="w-full py-20 bg-[#fcfdf6]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <UniversalHeading title="Business Impact" />
      </div>

      {/* Slider */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={sliderRef} className="keen-slider">
          {features.map((feature, index) => (
            <div key={index} className="keen-slider__slide">
              <div className="h-full rounded-xl border border-black/10 bg-[#fcfdf6] p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-black font-mono mb-4 leading-snug">
                  {feature.title}
                </h3>

                <div className="relative mt-auto aspect-square w-full rounded-lg overflow-hidden bg-[#fcfdf6]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-start gap-4 mt-8">
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="text-[#6c5f31] disabled:opacity-30"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="text-[#6c5f31] disabled:opacity-30"
            disabled={currentSlide === 4 || currentSlide === features.length - 4}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>
    </section>
  )
}
