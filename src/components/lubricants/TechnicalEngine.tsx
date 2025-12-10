import React from 'react'

const TechnicalEngine = () => {
  return (
    <div>
       <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mb-24">
  
            <p className="text-xl text-[#080c04]/70 max-w-3xl">
               The CarbonCut Engine
            </p>
          </div>

          {/* Typography List */}
          <div className="divide-y divide-black/10">
            {[
              'Real-time API ingestion',
              'Multi-stream OEM emissions tracking',
              'Automated LCI (Life Cycle Inventory) mapping',
              'Tiered supplier emission data modelling',
              'Dynamic emission factors from global datasets',
              'AI-based anomaly detection',
              'Internal & external audit-ready logs'
            ].map((item, idx) => (
              <div
                key={idx}
                className="pb-6"
              >
                <p className="text-4xl lg:text-5xl font-extrabold tracking-tight">
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

export default TechnicalEngine
