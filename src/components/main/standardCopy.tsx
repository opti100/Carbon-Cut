"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Standards = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  const standards = [
    {
      name: "Verified Carbon Standard",
      logo: "/CarbonCut-fe/Standards/VCS.png",
      description: "The world's leading voluntary carbon market program with verified carbon standards",
      tags: ["12 Years", "400+ Projects"],
      color: "bg-gradient-to-br from-primary/30 to-primary/10",
      sv: "/CarbonCut-fe/resize/SV1.jpg"
    },
    {
      name: "American Carbon Registry",
      logo: "/CarbonCut-fe/Standards/ACR.svg",
      description: "American Carbon Registry - Leading carbon offset program in North America",
      tags: ["12 Years", "400+ Projects"],
      color: "bg-gradient-to-br from-secondary/30 to-secondary/10",
      sv: "/CarbonCut-fe/resize/SV2.jpg"
    },
    {
      name: "Climate Action Reserve",
      logo: "/CarbonCut-fe/Standards/CAR.png",
      description: "Climate Action Reserve - High-quality carbon offset projects and protocols",
      tags: ["12 Years", "400+ Projects"],
      color: "bg-gradient-to-br from-primary/20 to-accent/20",
      sv: "/CarbonCut-fe/resize/SV3.jpg"
    },
    {
      name: "Gold Standard",
      logo: "/CarbonCut-fe/Standards/GS.svg",
      description: "Trusted standard for climate and sustainable development impact",
      tags: ["12 Years", "400+ Projects"],
      color: "bg-gradient-to-br from-accent/30 to-accent/10",
      sv: "/CarbonCut-fe/resize/SV4.jpg"
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const timer = setTimeout(() => {
      cards.forEach((card, index) => {
        const animation = gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            scroller: "[data-scroll-container]",
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        });

        if (animation.scrollTrigger) {
          scrollTriggersRef.current.push(animation.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(timer);
      scrollTriggersRef.current.forEach(trigger => trigger.kill());
      scrollTriggersRef.current = [];
      gsap.set(cards, { clearProps: "all" });
    };
  }, []);

  return (
    <div 
      className="relative pt-14 bg-background"
    >
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <p className="text-secondary/60 text-sm uppercase tracking-wider">Standards</p>
          <h2 className="text-6xl md:text-7xl font-semibold tracking-tight text-text">
            Carbon Standards
          </h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth px-6">
          {standards.map((standard, index) => (
            <div
              key={standard.name}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="flex-shrink-0 h-[600px] w-[340px] bg-accent rounded-4xl border border-text/10 overflow-hidden group hover:shadow-sm snap-center"
            >
              <div className="w-full flex justify-between h-16">
                <div>
                  {standard.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-block bg-background shadow text-black text-xs font-semibold px-3 py-1 rounded-full mt-4 ml-4"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <Image
                    src={standard.logo}
                    alt={`${standard.name} Logo`}
                    width={40}
                    height={40}
                    className="mt-4 mr-4 bg-white p-1 rounded-full"
                  />
                </div>
              </div>
              
              <div className="h-[200px] bg-accent px-6 relative overflow-hidden flex flex-col justify-between mb-6">
                <div className="min-h-[70px] flex items-end">
                  <div className="text-4xl md:text-5xl font-semibold tracking-tight text-text">
                    {standard.name}
                  </div>
                </div>

                <div className="text-sm text-secondary pb-4 pt-2">
                  {standard.description}
                </div>
              </div>

              <div className="h-full flex flex-col rounded-t-4xl bg-white overflow-hidden relative">
                <Image
                  src={standard.sv}
                  alt="Background Hero"
                  width={400}
                  height={200}
                  className="object-cover w-full"
                />

                <div className="absolute text-white top-60 left-6 flex justify-between items-center text-sm bg-transparent backdrop-blur-xl px-4 py-2 rounded-3xl z-20 transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-105 hover:-translate-y-1 group">
                  Learn More
                  <div className="p-1 bg-white rounded-full inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="text-accent-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Standards;