import React from 'react'

const Comparision = () => {
  return (
    <div>
          <section className="py-32 bg-[#111] text-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
                {/* Heading */}
                <h2 className="text-5xl lg:text-6xl font-light mb-20">
                  Why CarbonCut?
                </h2>
      
                {/* Table Block */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-5 text-left text-lg font-semibold text-white/60">
                          Feature
                        </th>
                        <th className="py-5 text-left text-lg font-semibold text-white/60">
                          Traditional Consultants
                        </th>
                        <th className="py-5 text-left text-lg font-semibold text-[#b0ea1d]">
                          CarbonCut
                        </th>
                      </tr>
                    </thead>
      
                    <tbody>
                      {[
                        ['Reporting', 'Annual', 'Real-time'],
                        ['Accuracy', 'Averaged factors', 'Input-level precision'],
                        ['Cost', 'High', 'Fractional'],
                        ['Visibility', 'None', 'SKU/product-level'],
                        ['Compliance', 'Manual', 'Auto-generated'],
                        ['Integrations', 'None', 'ERP, OEM, IoT, API'],
                      ].map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-white/10 last:border-0"
                        >
                          <td className="py-6 text-white/90">{row[0]}</td>
                          <td className="py-6 text-white/50">{row[1]}</td>
                          <td className="py-6 text-[#b0ea1d] font-medium">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
      
              </div>
            </section>
    </div>
  )
}

export default Comparision
