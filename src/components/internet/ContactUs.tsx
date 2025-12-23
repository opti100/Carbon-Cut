"use client"

import { ArrowRight } from "lucide-react";
import { EncryptedText } from "../ui/encrypted-text";
import Link from "next/link";

export default function PricingHero() {
  return (
    <>
      <div className="min-h-screen text-[#080c04] font-mono relative overflow-hidden bg-[#fcfdf6]">
        <div className="relative flex items-center justify-center p-6">
          <div className="max-w-6xl w-full grid md:grid-cols-2 border border-[#d1cebb] shadow-[0_0_0_1px_rgba(209,206,187,0.4)]">

            {/* LEFT SIDE */}
            <div className="p-10 border-r border-[#d1cebb] flex flex-col gap-8">
              <div>
                <p className="text-[#6c5f31] text-sm mb-4">// SUSTAINABILITY()</p>
                <h1 className="text-2xl md:text-3xl leading-tight">
                  Ready to Take Control of Your
                  <span className="text-[#b0ea1d]"> Digital Carbon Footprint?</span>
                </h1>
              </div>

              <div className="space-y-4 text-sm text-[#6c5f31]">
                <p>
                  Join the companies building the sustainable internet. Track,
                  reduce, and report your digital emissions with clarity.
                </p>
                <p>
                  Your competitors are already acting. Investors are asking
                  questions. Customers expect transparency.
                </p>
                <p className="font-semibold text-[#080c04]">The time to act is now.</p>
              </div>

              <div className="border border-[#d1cebb] bg-[#fcfdf6] p-4 text-xs italic text-[#6c5f31]">
                No credit card required · Set up in minutes · First report today
              </div>

              <div>
                <div className="nav-right-section">
                  <Link href="/signup" className="desktop-cta-link">
                    <button
                      type="button"
                      className="card-nav-cta-button"
                      style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                    >
                      <EncryptedText
                        text="SIGN_UP_NOW()"
                        encryptedClassName="text-neutral-500"
                        revealedClassName="text-[#080c04]"
                      />
                    </button>
                  </Link>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-10 flex flex-col gap-8">
              {/* Narrative */}
              <div>
                <p className="text-[#6c5f31] text-sm mb-2">// PLATFORM()</p>
                <p className="text-sm text-[#6c5f31]">
                  Everything you need to measure, manage, and reduce emissions across your digital infrastructure.
                </p>
              </div>

              {/* Feature blocks */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <FeatureBlock
                  title="[0] // CORE"
                  items={[
                    "Real-time emission tracking",
                    "Infrastructure-level insights",
                    "Investor-ready reporting",
                    "Reduction recommendations",
                  ]}
                />
                <FeatureBlock
                  title="[1] // EXTRAS"
                  items={[
                    "API & platform integrations",
                    "Compliance-ready exports",
                    "Team collaboration",
                    "Continuous updates",
                  ]}
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center mt-4">
                <Stat value="5 min" label="SETUP" />
                <Stat value="24/7" label="TRACKING" />
                <Stat value="∞" label="SCALABLE" />
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}

/* ---------------- Helpers ---------------- */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#d1cebb] py-4 rounded-md hover:bg-[#f6f7ef] transition">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-[#6c5f31] mt-1">{label}</p>
    </div>
  );
}

function FeatureBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-[#d1cebb] p-4 rounded-md hover:bg-[#f6f7ef] transition">
      <p className="text-[#6c5f31] mb-3 font-medium">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 items-start">
            <span className="text-[#b0ea1d] font-bold">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
