'use client'

export default function AboutSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">About CarbonCut</h2>
        <p className="text-lg text-gray-700 mb-4">
          CarbonCut is a comprehensive carbon emissions tracking and offset platform designed to help businesses measure, monitor, and reduce their environmental impact.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our platform integrates with Google Ads to track digital advertising carbon emissions, providing real-time insights and actionable data to help companies achieve their sustainability goals.
        </p>
        <p className="text-lg text-gray-700">
          By connecting your Google Ads account, CarbonCut calculates the carbon footprint of your digital campaigns and offers verified carbon offset solutions to achieve carbon neutrality.
        </p>
      </div>
    </section>
  )
}