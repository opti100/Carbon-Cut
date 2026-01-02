"use client";

import UniversalHeading from "../UniversalHeading";

export default function MonumaHero() {
  return (
    <section className="w-full h-[80vh] grid grid-cols-1 lg:grid-cols-[40%_60%]">
      {/* LEFT IMAGE */}
      <div className="h-full w-full">
        <img
          src="/internet/What-we-doing.png"
          alt="Interior space"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT PANEL */}
      <div className="flex items-center justify-center bg-[#d1cebb] bg-[url('/texture.png')] bg-cover bg-blend-overlay px-6 md:px-12">
        <div className="max-w-xl space-y-6 text-black">
          <UniversalHeading title="What we're doing" align="left" />

          <p className="text-sm md:text-base opacity-90 leading-relaxed">
          We're democratising carbon accounting for the digital age. Every company, from bootstrapped startups to enterprise giants, deserves access to accurate, real-time emission data without breaking the bank or hiring a team of consultants.
          </p>

          <p className="text-sm md:text-base opacity-90 leading-relaxed">
            Track, Decarbon and Report - transforms complex carbon calculations into source-level, actionable insights. You get a clear picture of your digital carbon footprint, industry benchmarks to see how you stack up, and concrete recommendations to reduce emissions while maintaining performance.
          </p>

          <p className="text-sm md:text-base opacity-90 leading-relaxed font-semibold">
            This isn't just reporting, it's your sure roadmap to becoming a net-zero company.
          </p>
        </div>
      </div>
    </section>
  );
}
