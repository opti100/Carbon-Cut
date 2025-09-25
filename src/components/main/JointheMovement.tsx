"use client";

import { Leaf, Zap, Globe } from "lucide-react";
import Image from "next/image";
import { BlurFade } from "../ui/blur-fade";

const values = [
  {
    icon: Zap,
    title: "100% Renewable",
    description:
      "Achieving a Sustainable Future Through Complete Transition to Clean Energy Sources.",
  },
  {
    icon: Leaf,
    title: "Lower Energy Bills",
    description:
      "Reducing Household and Business Costs by Increasing Energy Efficiency and Utilizing Renewable Resources.",
  },
  {
    icon: Globe,
    title: "Real Climate Impact",
    description:
      "Driving Tangible Change by Mitigating Climate Change Effects and Enhancing Environmental Resilience.",
  },
];

export default function JoinTheMovement() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Join the Movement
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Climate change isn’t coming—it’s here. Transitioning to sustainable
            energy isn’t just a choice; it’s a necessity. We believe in:
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Side - Values */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <BlurFade key={value.title} delay={0.2 + index * 0.1}>
                <div className="flex items-start p-6 border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-600 mr-4">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {value.description}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Right Side - Image + Text */}
          <div className="space-y-6">
            <BlurFade delay={0.4}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/solutions/JoinMovement.png"
                  alt="Family enjoying sustainable energy outdoors"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </BlurFade>

            <BlurFade delay={0.6}>
              <p className="text-gray-700 text-base leading-relaxed">
                We are dedicated to transforming the way individuals and
                businesses approach energy consumption. With a strong commitment
                to sustainability and innovation
              </p>
              <a
                href="#"
                className="inline-flex items-center text-green-600 font-medium hover:underline"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
