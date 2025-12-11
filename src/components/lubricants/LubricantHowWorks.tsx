import React from 'react'

const LubricantHowWorks = () => {
  const steps = [
    {
      title: "Integrate once — get real-time emission data forever.",
      description: `OEM, ERP, refinery systems, IoT sensors, and partner APIs.`,
    },
    {
      title: "CarbonCut Engine automatically calculates",
      description: `CO₂  
CH₄  
N₂O  
CO₂e per product  
Scope-wise breakdown  
Emission hotspots`,
    },
    {
      title: "One-click ESG reports",
      description: `For:  
ESRS • CSRD • SEC Climate • UK ETS • CDP • GRI • ISO`,
    },
    {
      title: "Product-level CO₂e labels",
      description: `Live, accurate numbers for every SKU.`,
    },
  ];

  return (
    <div>
      <section className="py-32 bg-[#fcfdf6] text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Left-aligned giant heading */}
          <h2
            className="
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold tracking-tight 
              text-[#d1cebb] mb-12 text-end
            "
          >
            How it works
          </h2>

          {/* Steps List */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-2">

                {/* Step Title */}
                <p className="text-2xl text-black font-semibold tracking-tight">
                  {step.title}
                </p>

                {/* Step Description (supports line breaks) */}
                <p className="text-lg text-black/80 font-light whitespace-pre-line leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
    </div>
  )
}

export default LubricantHowWorks
