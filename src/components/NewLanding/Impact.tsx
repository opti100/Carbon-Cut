"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

const ImpactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const numbersRef = useRef<(HTMLDivElement | null)[]>([])
  const descriptionsRef = useRef<(HTMLParagraphElement | null)[]>([])

  const Numbers = [
    {
      number: "1M+",
      description: "Tons of CO2e offset through verified carbon credit projects worldwide",
    },
    {
      number: "500K+",
      description: "Active users globally committed to reducing their carbon footprint",
    },
    {
      number: "10K+",
      description: "Sustainable projects supported across different sectors and regions",
    },
    {
      number: "50+",
      description: "Countries reached with our carbon offsetting solutions and services",
    },
    {
      number: "200M+",
      description: "Trees planted as part of our reforestation and carbon sequestration initiatives",
    },
  ]

  useEffect(() => {
    // Ensure all refs are properly set and elements exist
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[]
    const numbers = numbersRef.current.filter(Boolean) as HTMLDivElement[]
    const descriptions = descriptionsRef.current.filter(Boolean) as HTMLParagraphElement[]

    if (items.length === 0 || numbers.length === 0 || descriptions.length === 0) return

    // Set initial state for descriptions
    gsap.set(descriptions, {
      opacity: 0,
      x: -80,
    })

    items.forEach((item, index) => {
      // Check if the current number element exists
      if (!numbers[index]) return

      // Split text for number animation
      const splitNumber = new SplitText(numbers[index], { 
        type: "chars",
      })

      // Set initial state for number chars
      gsap.set(splitNumber.chars, {
        opacity: 0,
        y: 100,
        rotation: 10,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      })

      // Animate number chars one by one
      tl.to(splitNumber.chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      })

      // Animate description after number
      tl.to(
        descriptions[index],
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4"
      )
    })

    return () => {
      // Cleanup SplitText instances and ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      items.forEach((_, index) => {
        const splitInstance = (numbers[index] as any)?._splitText
        if (splitInstance) {
          splitInstance.revert()
        }
      })
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative pt-14 pb-20 mx-4 md:mx-8 bg-background border-r border-l border-dashed border-opacity-10"
    >
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <div className="mx-auto max-w-7xl px-6">
        <p className="text-secondary/60 text-sm uppercase tracking-wider">By The Numbers</p>
        <h2 className='text-6xl md:text-7xl font-semibold tracking-tight text-text mb-12'>
          Our Impact
        </h2>

        <div className="space-y-16 md:space-y-20">
          {Numbers.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-8 border-b border-dashed border-text/10 last:border-b-0"
            >
              <div className="overflow-visible">
                <div
                  ref={(el) => {
                    numbersRef.current[index] = el
                  }}
                  className="text-8xl md:text-9xl font-bold text-text tracking-tight leading-none inline-block"
                >
                  {item.number}
                </div>
              </div>

              <div className="overflow-hidden">
                <p
                  ref={(el) => {
                    descriptionsRef.current[index] = el
                  }}
                  className="text-lg md:text-xl text-secondary leading-relaxed"
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImpactSection