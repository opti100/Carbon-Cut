import React from 'react';
import { ArrowUpRight, ArrowUpLeft, Award } from 'lucide-react';
import Image from 'next/image';

export default function HowItsWorkTwo() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <div className="inline-block border-2 border-green-500 rounded-full px-4 py-2 mb-8">
          <span className="text-sm">How It Works</span>
        </div>

        <h1 className="text-5xl font-bold mb-6">
          Track, Cut, and Offset Emissions
        </h1>

        <p className="text-black text-lg max-w-2xl mx-auto leading-relaxed">
          Take control of your environmental impact with clear, reliable tools. From calculating your footprint to offsetting
          with verified projects, we help you build a transparent, measurable, and sustainable future.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Step 1 - Calculate */}
        <div className="flex flex-col lg:flex-row items-center mb-16">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <div className="text-sm text-black mb-2">Step 1</div>
            <h2 className="text-4xl font-bold mb-4 flex items-center">
              Calculate
              <ArrowUpRight className="ml-2 text-green-400" size={32} />
            </h2>
            <p className="text-black text-lg">
              See emissions by channel and campaign, and spot the biggest impact areas.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full h-64 bg-gradient-to-r from-red-900 to-purple-900 rounded-lg overflow-hidden">
              <Image
                src="/dashboard-chart.jpg"
                alt="Dashboard Chart"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Step 2 - Analyze */}
        <div className="flex flex-col lg:flex-row-reverse items-center mb-16">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12">
            <div className="text-sm text-black mb-2">Step 2</div>
            <h2 className="text-4xl font-bold mb-4 flex items-center">
              Analyze
              <ArrowUpLeft className="ml-2 text-green-400" size={32} />
            </h2>
            <p className="text-black text-lg">
              See emissions by channel and campaign, and spot the biggest impact areas.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full h-64 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg overflow-hidden">
              <Image
                src="/green-moss.jpg"
                alt="Green Moss"
                fill
                className="object-cover"
              />
              {/* Floating elements */}
              <div className="absolute top-4 right-8">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800">$</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-12">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800">$</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Offset */}
        <div className="flex flex-col lg:flex-row items-center mb-16">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <div className="text-sm text-black mb-2">Step 3</div>
            <h2 className="text-4xl font-bold mb-4 flex items-center">
              Offset
              <ArrowUpRight className="ml-2 text-green-400" size={32} />
            </h2>
            <p className="text-black text-lg">
              Choose verified projects to balance your footprint and support climate action.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full h-64 bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg overflow-hidden">
              <Image
                src="/green-moss.jpg"
                alt="Offset Project"
                fill
                className="object-cover"
              />
              {/* Overlay design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-black/20 rounded-full"></div>
                <div className="absolute w-16 h-16 bg-black/40 rounded-lg transform rotate-12"></div>
                <div className="absolute w-12 h-8 bg-black/30 rounded transform -rotate-45 translate-x-8 translate-y-4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Certify */}
        <div className="flex flex-col lg:flex-row-reverse items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12">
            <div className="text-sm text-black mb-2">Step 4</div>
            <h2 className="text-4xl font-bold mb-4 flex items-center">
              Certify
              <ArrowUpLeft className="ml-2 text-green-400" size={32} />
            </h2>
            <p className="text-black text-lg">
              Earn verified certification and showcase your progress with clients and partners.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full h-64 bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/green-moss.jpg"
                alt="Certification"
                fill
                className="object-cover"
              />
              {/* Overlay design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-black/20 rounded-full"></div>
                <div className="absolute w-12 h-12 bg-black/40 rounded-lg transform rotate-45"></div>
                <div className="absolute w-8 h-6 bg-black/30 rounded transform -rotate-12 translate-x-6 translate-y-6"></div>
              </div>
              <Award size={48} className="absolute text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
