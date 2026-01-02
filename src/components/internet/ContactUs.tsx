"use client";

import { ArrowRight } from "lucide-react";
import { EncryptedText } from "../ui/encrypted-text";
import Link from "next/link";

export default function PricingHero() {
  return (
    <section className="min-h-screen bg-[#fcfdf6] text-[#080c04] font-mono relative overflow-hidden py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------- Desktop: 2 columns ---------- */}
        <div className="hidden lg:grid grid-cols-2 border border-[#d1cebb] shadow-[0_0_0_1px_rgba(209,206,187,0.4)]">
          {/* LEFT SIDE */}
          <div className="p-10 border-r border-[#d1cebb] flex flex-col gap-8">
            <HeaderLeft />
            <TextLeft />
            <Note />
            <CTAButton />
          </div>

          {/* RIGHT SIDE */}
          <div className="p-10 flex flex-col gap-8">
            <HeaderRight />
            <FeatureGrid />
            <Metrics />
          </div>
        </div>

        {/* ---------- Mobile / Tablet: Stacked ---------- */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* LEFT CONTENT */}
          <div className="bg-[#fcfdf6] border border-[#d1cebb] rounded-2xl p-6 shadow-sm">
            <HeaderLeft />
            <TextLeft />
            <Note />
            <CTAButton />
          </div>

          {/* RIGHT CONTENT */}
          <div className="bg-[#fcfdf6] border border-[#d1cebb] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <HeaderRight />
            <FeatureGrid isMobile />
            <Metrics isMobile />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Components ---------------- */

function HeaderLeft() {
  return (
    <div>
      <p className="text-[#6c5f31] text-sm mb-2">// SUSTAINABILITY()</p>
      <h1 className="text-2xl md:text-3xl leading-tight">
        Ready to Take Control of Your{" "}
        <span className="text-[#b0ea1d]">Digital Carbon Footprint?</span>
      </h1>
    </div>
  );
}

function TextLeft() {
  return (
    <div className="space-y-2 text-sm text-[#6c5f31]">
      <p>
        Join the companies building the sustainable internet. Track, reduce, and report your digital emissions with clarity.
      </p>
      <p>
        Your competitors are already acting. Investors are asking questions. Customers expect transparency.
      </p>
      <p className="font-semibold text-[#080c04]">The time to act is now.</p>
    </div>
  );
}

function Note() {
  return (
    <div className="border border-[#d1cebb] bg-[#fcfdf6] p-3 text-xs italic text-[#6c5f31] rounded-md">
      No credit card required · Set up in minutes · First report today
    </div>
  );
}

function CTAButton() {
  return (
    <div>
      <Link href="/signup">
        <button
          type="button"
          className="w-full md:w-auto px-6 py-3 rounded-md font-mono font-semibold text-[#080c04] bg-[#b0ea1d] hover:bg-[#a4d815] transition"
        >
          <EncryptedText
            text="SIGN_UP_NOW()"
            encryptedClassName="text-neutral-500"
            revealedClassName="text-[#080c04]"
          />
        </button>
      </Link>
    </div>
  );
}

function HeaderRight() {
  return (
    <div>
      <p className="text-[#6c5f31] text-sm mb-1">// PLATFORM()</p>
      <p className="text-sm text-[#6c5f31]">
        Everything you need to measure, manage, and reduce emissions across your digital infrastructure.
      </p>
    </div>
  );
}

function FeatureGrid({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-6"} text-sm mt-4`}>
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
  );
}

function Metrics({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className={`grid ${isMobile ? "grid-cols-3 gap-4 mt-4" : "grid-cols-3 gap-4 text-center mt-4"}`}>
      <Stat value="5 min" label="SETUP" />
      <Stat value="24/7" label="TRACKING" />
      <Stat value="∞" label="SCALABLE" />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#d1cebb] py-4 rounded-md hover:bg-[#f6f7ef] transition flex flex-col items-center">
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
