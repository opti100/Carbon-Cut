"use client";

import { BlurFade } from "../ui/blur-fade";
import { ParallaxScroll } from "../ui/parallax-scroll";

export function DigitalEcosystem() {
  return (
    <>
      {/* Heading */}
      <BlurFade
        delay={0.1}
        inView
        className="mb-6 text-right max-w-7xl mx-auto px-4 mt-20"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
          Built for the Entire Digital Ecosystem
        </h2>
        <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg leading-relaxed">
          Whether you're disrupting finance or revolutionising entertainment, we
          understand your business
        </p>
      </BlurFade>

      {/* Parallax Cards */}
      <ParallaxScroll
        items={DATA.map((item) => ({
          src: item.image,
          overlay: (
            <div className="group absolute inset-0 flex items-end">
              <div
                className="
                  m-4 max-w-[92%]
                  rounded-2xl
                  bg-gradient-to-t from-black/80 via-black/50 to-black/20
                  p-4 sm:p-5
                  backdrop-blur-sm
                  transition-all duration-300
                "
              >
                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-1 text-xs sm:text-sm text-white/80 leading-relaxed
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0
                  "
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ),
        }))}
      />
    </>
  );
}


const DATA = [
  {
    title: "Fintech & Digital Banking",
    desc: "Track emissions from transactions, API calls, data processing, and customer authentication systems. Meet ESG requirements that investors and regulators demand.",
    image:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=3387&q=80",
  },
  {
    title: "SaaS / Enterprise Software",
    desc: "Measure the carbon cost of your platform's compute power, storage, and data transfer. Show customers you're serious about sustainability.",
    image:
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=3070&q=80",
  },
  {
    title: "E-Commerce",
    desc: "From product browsing to checkout, understand the emissions your online store generates. Include payments, inventory, and recommendations.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Media Streaming & Content Platforms",
    desc: "Track emissions from encoding, storage, CDN delivery, and billions of streaming minutes across your content library.",
    image:
      "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Digital Advertising, MarTech & EdTech",
    desc: "Every ad served, email sent, and course delivered—measure it all and prove you're building sustainably.",
    image:
      "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Mobility & Travel Platforms",
    desc: "Track the digital operations behind booking systems, route optimisation, and real-time travel updates.",
    image:
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=3070&q=80",
  },
  {
    title: "Gaming, Design & Creator Platforms",
    desc: "Rendering, processing, file storage, and collaboration tools all have measurable environmental impact.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Telecom, Cloud & Internet Infrastructure",
    desc: "Gain transparency into emissions at scale while building the backbone of the internet.",
    image:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=3387&q=80",
  },
];
