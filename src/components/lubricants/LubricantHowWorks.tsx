import React from 'react'

const LubricantHowWorks = () => {
  return (
    <div>
        <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Left-aligned giant heading */}
          <h2
            className="
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold tracking-tight 
              text-[#d1cebb] mb-12
            "
          >
            Business <br />Impact
          </h2>

          {/* Two-column list */}
          <div className="mt-20 grid md:grid-cols-2 gap-10">

            {[
              "Reduce carbon taxes by up to 17%",
              "Low cost, low effort activity",
              "Double your accuracy and quality of CO₂e reporting",
              "Win ESG-driven tenders",
              "Increase stakeholder confidence",
              "Improve supply chain transparency",
              "Eliminate manual carbon reporting",
              "Track progress toward Net-Zero 2030/2050"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">

                {/* Minimal geometric icon */}
                {/* <span className="mt-1 block w-3 h-3 border border-black rotate-12"></span> */}

                {/* Text */}
                <p className="text-xl text-black font-light tracking-tight">
                  {item}
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
