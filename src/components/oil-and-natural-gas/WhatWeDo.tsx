"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import UniversalHeading from "../UniversalHeading"

gsap.registerPlugin(ScrollTrigger)

const WhatWeDo = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const achievements = [
    {
      image: "/oil-natural-gas/Real-Time.png",
      title: "Real-time data",
      description: "Capture across assets and facilities",
    },
    {
      image: "/oil-natural-gas/Direct-Indirect-Emissions.png",
      title: "Direct & indirect emissions",
      description: "Tracking including combustion, leaks, flaring, and venting",
    },
    {
      image: "/oil-natural-gas/Automated-Reporting.png",
      title: "Automated reporting",
      description: "Aligned with industry and regulatory standards like GHG Protocol and EPA methods",
    },
  ]

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)
    const images = imagesRef.current.filter(Boolean)

    if (cards.length === 0) return

    const timer = setTimeout(() => {
      // Check if locomotive scroll is active
      const scrollContainer = document.querySelector("[data-scroll-container]")
      const useLocomotiveScroll = scrollContainer !== null

      // Initial state - all cards hidden below
      gsap.set(cards, {
        opacity: 0,
        yPercent: 100,
      })

      gsap.set(images, {
        scale: 1.4,
      })

      // Animate cards sequentially - each appears after the previous one
      cards.forEach((card, index) => {
        // Calculate staggered start positions
        const startOffset = index * 30 // Each card starts 30% later than previous
        
        gsap.to(card, {
          opacity: 1,
          yPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: useLocomotiveScroll ? "[data-scroll-container]" : undefined,
            start: `top ${80 - startOffset}%`, // Staggered start
            end: `top ${20 - startOffset}%`,   // Staggered end
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        })

        // Image parallax zoom
        if (images[index]) {
          gsap.to(images[index], {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              scroller: useLocomotiveScroll ? "[data-scroll-container]" : undefined,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          })
        }
      })

      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-20  bg-[#fcfdf6] " 
      data-scroll-section
    >
      <div className="w-full border-t border-dashed border-[#6c5f31]/20 mb-8"></div>

      <div className="w-full px-0">

           <UniversalHeading title="What We Do" description="End-to-End Emission Monitoring for Oil & Gas" align="right" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-0">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] overflow-hidden group cursor-pointer"
            >
              {/* Image Container */}
              <div
                ref={(el) => {
                  imagesRef.current[index] = el
                }}
                className="absolute inset-0 overflow-hidden"
              >
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  fill  
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">
                {/* Description - Shows on hover */}
                <p className="text-sm md:text-base text-white/90 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  {achievement.description}
                </p>

                {/* Title - Always visible */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold transform group-hover:translate-y-0 transition-all duration-500 ease-out">
                  {achievement.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

     

     
    </section>
  )
}

export default WhatWeDo