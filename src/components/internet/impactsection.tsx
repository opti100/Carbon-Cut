'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import UniversalHeading from '../UniversalHeading'
import { ArrowRight, Briefcase, Building2, Cpu, Fan, Zap } from 'lucide-react'

export default function ImpactSection() {
  // MOBILE/TABLET: all accordions closed by default
  const [active, setActive] = useState('')
  const activeTab = TABS.find((t) => t.id === active) || TABS[0] // fallback for desktop hover

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <UniversalHeading
        title="How We Calculate Your Emissions"
        description="We've built the most comprehensive digital emission tracking methodology that actually reflects reality:"
        align="right"
      />

      {/* ---------- DESKTOP UI ---------- */}
      <div className="hidden lg:grid grid-cols-2 gap-10 mt-6">
        {/* LEFT list */}
        <div>
          {TABS.map((tab) => {
            const isActive = active === tab.id || active === '' // default first tab active visually
            return (
              <div
                key={tab.id}
                onMouseEnter={() => setActive(tab.id)}
                className={`cursor-pointer p-6 rounded-2xl transition
                 "bg-[#f8fceb] shadow-sm" "}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-black/60 mb-1">{tab.number}</div>
                    <h3 className="text-xl font-semibold mb-1">{tab.title}</h3>
                    {tab.description && (
                      <p className="text-sm text-black/70">{tab.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT panel */}
        <div className=" p-8 rounded-2xl min-h-[430px]">{activeTab.panel}</div>
      </div>

      {/* ---------- MOBILE / TABLET ACCORDION ---------- */}
      <div className="lg:hidden space-y-4 mt-4">
        {TABS.map((tab) => {
          const isOpen = active === tab.id

          return (
            <div
              key={tab.id}
              className="rounded-2xl border border-[#ecebdc] bg-[#fafdf0]"
            >
              <button
                onClick={() => setActive(isOpen ? '' : tab.id)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <div className="text-left">
                  <p className="text-xs text-black/60">{tab.number}</p>
                  <h3 className="text-base font-semibold">{tab.title}</h3>
                </div>
                <ChevronDown
                  className={`transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm">
                  {tab.description && (
                    <p className="text-black/70 mb-3">{tab.description}</p>
                  )}
                  <div>{tab.panel}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- your SAME data ---------- */

const physicalItems = [
  { label: 'Office electricity consumption', icon: Zap },
  { label: 'Workspace and facility infrastructure', icon: Building2 },
  { label: 'Employee commutes and business travel', icon: Briefcase },
  { label: 'Physical hardware and IT equipment', icon: Cpu },
  { label: 'Cooling, power backup, and facilities management', icon: Fan },
]

const TABS = [
  {
    id: 'measure',
    number: '01',
    title: '80–85% Digital Operations',
    description: 'This is where your real footprint lives:',
    panel: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: 'Website & App Traffic',
            desc: 'Every visitor, every session, every transaction',
          },
          {
            title: 'User Duration',
            desc: 'How long customers stay on your platform',
          },
          {
            title: 'Data Transfer',
            desc: 'Bandwidth consumed across pages, media, and APIs',
          },
          {
            title: 'Server Infrastructure',
            desc: 'Where your databases are hosted and how they’re powered',
          },
          {
            title: 'Backend Operations',
            desc: 'API calls, compute usage, background processing',
          },
          {
            title: 'Content Delivery Networks',
            desc: 'Global infrastructure serving your content',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl p-4 border border-[#ecebdc]">
            <p className="font-medium text-sm mb-1">{item.title}</p>
            <p className="text-sm text-black/60">{item.desc}</p>
          </div>
        ))}
      </div>
    ),
  },

  {
    id: 'report',
    number: '02',
    title: '15–20% Physical Operations',
    description: 'Your traditional footprint still matters:',
    panel: (
      <div className="space-y-3">
        {physicalItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-[#ecebdc] px-4 py-3 text-sm text-black/80 flex items-center gap-2"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    ),
  },

  {
    id: 'act',
    number: '03',
    title: '100% Reporting Accuracy Achievable',
    panel: (
      <div className="rounded-xl border border-[#ecebdc] p-5 text-sm text-black/70 leading-relaxed">
        Unlike traditional carbon accounting methods that rely on assumptions and industry
        averages, we track actual usage data across your digital and physical operations.
        <div className="h-px bg-[#e7e6d8] my-4" />
        This doubles your reporting accuracy and delivers credible, audit-ready emission
        reports your customers and regulators can trust.
      </div>
    ),
  },
]
