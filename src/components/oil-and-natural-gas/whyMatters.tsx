"use client";

import AnimatedHeading from "../internet/InternetHeading";

export default function WhyItMatters() {
  return (
    <section
      className="
        w-full 
        bg-[#fcfdf6] 
        flex 
        flex-col 
        lg:justify-center
        min-h-0
      "
    >
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">

        <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-10">

          {/* Label */}
          <p className="text-center lg:text-left text-xs sm:text-sm tracking-widest text-[#6c5f31]">
            Why It Matters
          </p>

          {/* Heading */}
          <AnimatedHeading
            text="Oil and gas operations generate complex and widespread carbon emissions that require accurate measurement and reporting to meet regulatory standards and ESG goals."
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif text-[#325342] leading-snug text-center lg:text-left"
          />

          {/* Subtext */}
          <p className="uppercase text-[#325342] tracking-wide text-xs sm:text-sm md:text-base text-center lg:text-left max-w-3xl">
            Traditional methods miss key sources like methane leaks and flaring, leading to gaps in compliance and decarbonization
          </p>

        </div>
      </div>
    </section>
  );
}
