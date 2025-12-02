"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Step {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string };
  image?: string;
}

const steps: Step[] = [
  {
    step: 1,
    title: "Connect",
    subtitle: "Integrate once — measure forever",
    description: "Connect your ad platforms, data streams, or infrastructure once. CarbonLive immediately begins real-time CO₂e tracking across servers, delivery networks, and data transfers — using live grid-intensity data and verified emission factors.",
    metrics: { label: "Instant integration, instant visibility" },
    image: "/how-it-works/connect.jpg"
  },
  {
    step: 2,
    title: "Monitor",
    subtitle: "Real-time insights you can act on",
    description: "View live CO₂e totals, forecasted footprints, and AI-agent recommendations for immediate emission reduction — all mapped to GHG Protocol categories.",
    metrics: { label: "Live dashboards. Instant accountability." },
    image: "/how-it-works/monitor.jpg"
  },
  {
    step: 3,
    title: "Auto-Offset",
    subtitle: "Residuals retired automatically",
    description: "When emissions hit a defined threshold or a campaign ends, CarbonLive automatically retires verified carbon credits from approved registries such as Verra, Gold Standard, ACR.",
    metrics: { label: "Verified offsets, executed automatically." },
    image: "/how-it-works/offset.jpg"
  },
  {
    step: 4,
    title: "Certify & Share",
    subtitle: "Proof you can publish",
    description: "Every offset completed through CarbonLive generates a measure-linked certificate and on-chain reference hash, providing finance teams, auditors, and clients with verifiable proof of real-time emission control and neutrality.",
    metrics: { label: "Transparent data. Trusted results." },
    image: "/how-it-works/certify.jpg"
  },
];

export default function HowItWorksCopy() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (scrollY - sectionTop + windowHeight / 2) / sectionHeight
      ));
      setScrollProgress(progress);

      // Determine active step
      const stepIndex = Math.min(3, Math.floor(progress * 4));
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative z-10 overflow-clip bg-[#fcfdf6]"
      id="what-we-do"
      aria-label="What We Do"
      style={{ "--progress": scrollProgress } as React.CSSProperties}
    >
      {/* Parallax Wrapper - 800vh for desktop, 400vh for mobile */}
      <div className="prllx-wrapper relative flex h-[400lvh] flex-col overflow-clip md:h-[800lvh] md:flex-row">
        
        {/* Left Side - Sticky Fields */}
        <div className="fields-sticky sticky top-0 z-10 h-lvh w-full md:w-1/2">
          {/* Dashed Grid Background */}
          <div 
            className="absolute top-0 -z-10 left-20 h-full w-4 text-[#6c5f31]"
            style={{
              opacity: 1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M 0 0 L 10 0 M 0 0 L 0 10' stroke='currentColor' stroke-dasharray='2 2' stroke-width='1' vector-effect='non-scaling-stroke'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "1em 1em",
              backgroundPosition: "center center"
            }}
          />
          
          {/* Fields Container */}
          <div 
            ref={fieldsRef}
            className="relative max-sm:overflow-x-clip"
            style={{
              transform: `translateY(-${scrollProgress * steps.length * 25}rem)`
            }}
          >
            <ul className="fields-wrapper relative flex w-full shrink-0 flex-row md:translate-y-[50vh] md:flex-col">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const rotationDegrees = isActive ? 720 : (index < activeStep ? 720 : 0);
                
                return (
                  <li
                    key={index}
                    className="inline-flex w-full shrink-0 items-center pt-20 pb-16 md:py-24 border-[#6c5f31]/25 border-dashed first:border-transparent md:border-t max-sm:bg-[#fcfdf6]"
                  >
                    {/* Step Number */}
                    <div 
                      className="w-16 shrink-0 font-medium font-mono text-sm transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0.3 }}
                    >
                      <div>0{step.step}</div>
                    </div>
                    
                    {/* Step Content */}
                    <div 
                      className="flex-1 flex flex-col items-start gap-4 md:gap-6 transition-opacity duration-300 pl-6"
                      style={{ opacity: isActive ? 1 : 0.3 }}
                    >
                      {/* Icon with Rotating Outline */}
                      
                      <div className="relative h-10 w-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 40 40"
                          className="icons-outline absolute inset-0 text-[#6c5f31] transition-transform duration-1000"
                          style={{ transform: `rotate(${rotationDegrees}deg)` }}
                        >
                          <path d="M1 32.653V39h6.347v1H0v-7.347zm39 0V40h-7.347v-1H39v-6.347zM7.347 0v1H1v6.347H0V0zM40 0v7.347h-1V1h-6.347V0z" />
                        </svg>
                        
                        {/* Sliding Icon */}
                        <div 
                          className="absolute inset-0 inline-flex overflow-hidden transition-transform duration-500"
                          style={{
                            transform: isActive ? "translateX(0)" : "translateX(-100%)",
                            opacity: isActive ? 1 : 0
                          }}
                        >
                          <div className="w-10 h-10 bg-[#b0ea1d] rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </div> 
                     
                      
                      {/* Title with Double Layer Reveal */}
                      <h2 className="-mb-2.5 overflow-clip font-medium text-2xl md:text-4xl text-[#080c04]">
                        <div 
                          className="title-wrapper relative flex flex-col transition-transform duration-700"
                          style={{
                            transform: isActive ? "translateY(-100%)" : "translateY(0)"
                          }}
                        >
                          <span className="absolute top-full left-0 pb-2.5">{step.title}</span>
                          <span className="pb-2.5">{step.title}</span>
                        </div>
                      </h2>
                      
                      {/* Subtitle */}
                      <p className="text-base md:text-lg font-semibold text-[#6c5f31]">
                        {step.subtitle}
                      </p>
                      
                      {/* Description */}
                      <p className="text-sm text-[#6c5f31]/80 leading-[1.4] max-w-lg">
                        {step.description}
                      </p>
                      
                      {/* Metrics Badge */}
                      <div className="inline-block bg-[#b0ea1d]/10 border border-[#b0ea1d]/30 rounded-full px-5 py-2.5">
                        <span className="text-xs md:text-sm font-semibold text-[#6c5f31]">
                          {step.metrics.label}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        {/* Right Side - Sticky Animation/Image Panel */}
        <div className="absolute top-0 right-0 z-0 h-full w-full md:w-1/2">
          <div className="anim-wrapper sticky top-0 left-0 h-lvh w-full">
            <div 
              className="anim-bg-wrapper absolute inset-0"
              style={{ transform: `translateY(${scrollProgress * 10}%)` }}
            >
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="anim-bg-img absolute inset-0 transition-opacity duration-1000"
                  style={{
                    opacity: activeStep === index ? 1 : 0,
                    visibility: activeStep === index ? "visible" : "hidden"
                  }}
                >
                  {/* Placeholder - replace with actual images */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#b0ea1d] to-[#6c5f31] flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-8xl font-bold opacity-20 mb-4">0{step.step}</div>
                      <div className="text-3xl font-bold mb-2">{step.title}</div>
                      <div className="text-xl opacity-80">{step.subtitle}</div>
                    </div>
                  </div>
                  {/* Uncomment when you have images */}
                  {/* <Image 
                    src={step.image || ''} 
                    alt={step.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
