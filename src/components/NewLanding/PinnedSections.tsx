"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function LocomotivePinnedSections() {
  const containerRef = useRef<HTMLDivElement>(null)

  const sections = [
    {
      title: "Measure",
      description: "Calculate your carbon footprint with precision",
      color: "bg-red-600"
    },
    {
      title: "Track",
      description: "Monitor your emissions in real-time",
      color: "bg-blue-600"
    },
    {
      title: "Offset",
      description: "Neutralize your environmental impact",
      color: "bg-green-600"
    },
    {
      title: "Impact",
      description: "Make a lasting difference for the planet",
      color: "bg-purple-600"
    }
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const timer = setTimeout(() => {
      const sectionElements = gsap.utils.toArray<HTMLElement>(
        '.pin-section'
      )

      sectionElements.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          scroller: "[data-scroll-container]", // Use the existing Locomotive container
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          markers: false,
        })
      })

      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, []);

  return (
    <>
      <header>
        <a href="https://greensock.com/scrolltrigger">
          <Image
            src="https://greensock.com/wp-content/uploads/2020/10/ScrollTrigger-logo.svg"
            alt="ScrollTrigger logo"
            width={200}
            height={40}
            className="h-10 mx-auto"
          />
        </a>
      </header>
  
      <div ref={containerRef} className="w-full">
        {sections.map((section, index) => (
          <section
            key={index}
            className={`pin-section h-screen w-full flex items-center justify-center ${section.color}`}
            data-scroll
            data-scroll-speed="1"
          >
            <div className="text-center text-white">
              <h2 className="text-6xl md:text-8xl font-extrabold mb-4">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl font-medium opacity-90">
                {section.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}