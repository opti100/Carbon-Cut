"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import UniversalHeading from "../UniversalHeading"

const TABS = [
  {
    id: "measure",
    number: "01",
    title: "80–85% Digital Operations",
    description: "This is where your real footprint lives:",
    panel: (
  <div className="h-full flex flex-col">
   

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        {
          title: "Website & App Traffic",
          desc: "Every visitor, every session, every transaction",
        },
        {
          title: "User Duration",
          desc: "How long customers stay on your platform",
        },
        {
          title: "Data Transfer",
          desc: "Bandwidth consumed across pages, media, and APIs",
        },
        {
          title: "Server Infrastructure",
          desc: "Where your databases are hosted and how they’re powered",
        },
        {
          title: "Backend Operations",
          desc: "API calls, compute usage, background processing",
        },
        {
          title: "Content Delivery Networks",
          desc: "Global infrastructure serving your content",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="rounded-lg  bg-[#f8fceb] p-4 hover:shadow-sm transition"
        >
          <p className="font-medium text-sm mb-1">{item.title}</p>
          <p className="text-sm text-black/60 leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
)

  },

  {
    id: "report",
    number: "02",
    title: "15–20% Physical Operations",
    description: "Your traditional footprint still matters:",
   panel: (
  <div className="h-full flex flex-col">
   

    <div className="space-y-3">
      {[
        "Office electricity consumption",
        "Workspace and facility infrastructure",
        "Employee commutes and business travel",
        "Physical hardware and IT equipment",
        "Cooling, power backup, and facilities management",
      ].map((item) => (
        <div
          key={item}
          className="rounded-lg  bg-[#f8fceb] px-4 py-3 text-sm text-black/80"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
)

  },

  {
    id: "act",
    number: "03",
    title: "100% Reporting Accuracy Achievable",
   panel: (
  <div className="h-full flex flex-col justify-between">
    <div>
     

      <div className="rounded-lg  bg-[#f8fceb] p-5">
        <p className="text-sm text-black/70 leading-relaxed">
          Unlike traditional carbon accounting methods that rely on
          assumptions and industry averages, we track actual usage data
          across your digital and physical operations.
        </p>

        <div className="h-px bg-[#d1cebb] my-4" />

        <p className="text-sm text-black/70 leading-relaxed">
          This doubles your reporting accuracy and delivers credible,
          audit-ready emission reports that your customers, stakeholders,
          investors, and regulators can trust.
        </p>
      </div>
    </div>
  </div>
)

  },
]


export default function ImpactSection() {
  const [active, setActive] = useState("measure")

  const activeTab = TABS.find((t) => t.id === active)!

  return (
    <>
  
    <section className="max-w-7xl mx-auto px-6 pb-12">
      {/* Heading */}
     <UniversalHeading title="How We Calculate Your Emissions" description="We've built the most comprehensive digital emission tracking methodology that actually reflects reality:" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT */}
        <div className=" overflow-hidden">
          {TABS.map((tab) => {
            const isActive = active === tab.id
            return (
              <div
                key={tab.id}
                onMouseEnter={() => setActive(tab.id)}
                className={`cursor-pointer p-8 transition `}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm text-black mb-2">
                      {tab.number}
                    </div>
                    <h3 className="text-2xl font-medium mb-2">
                      {tab.title}
                    </h3>
                    <p className="text-sm text-black/70 max-w-md">
                      {tab.description}
                    </p>
                  </div>

                 
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT */}
        <div className=" bg-[#fcfdf6] p-8 min-h-[420px] transition">
          {activeTab.panel}
        </div>
      </div>
    </section>
   <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
      </>
  )
}

/* ---------- helpers ---------- */

function Card({ title }: { title: string }) {
  return (
    <div className="rounded-lg bg-white border p-3 text-sm font-medium">
      <div className="h-28 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 mb-2" />
      {title}
    </div>
  )
}
