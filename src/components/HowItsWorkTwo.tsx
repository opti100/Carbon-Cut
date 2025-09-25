import React from 'react';
import { ArrowUpRight, ArrowUpLeft } from 'lucide-react';
import Image from 'next/image';
import { BlurFade } from '../components/ui/blur-fade';

export default function EmissionsTracker() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Header */}
            <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="inline-block bg-white px-4 py-2 mb-6 sm:mb-8">
                    <BlurFade delay={0.1} inView>
                        <h4 className="text-2xl sm:text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
                            How it <span className="text-tertiary">works</span>
                        </h4>
                    </BlurFade>
                </div>

                <BlurFade delay={0.1} inView>
                    <h4 className="text-2xl sm:text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black mb-4">
                        Track, Cut, <span className="text-tertiary">and</span> Offset <span className="text-tertiary">Emissions</span>
                    </h4>
                </BlurFade>

                <p className="text-black text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                    Take control of your environmental impact with clear, reliable tools. From calculating your footprint to offsetting
                    with verified projects, we help you build a transparent, measurable, and sustainable future.
                </p>
            </div>

            {/* Steps */}
            <div className="max-w-6xl mx-auto px-4 pb-12 sm:pb-16 text-black">
                {/* Step 1 - Calculate */}
                <div className="flex flex-col lg:flex-row items-center mb-12 lg:mb-16">
                    <div className="w-full lg:w-1/5 mb-6 lg:mb-0 lg:pr-8 text-center lg:text-left">
                        <div className="text-sm text-black mb-2">Step 1</div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 flex justify-center lg:justify-start items-center text-black">
                            Calculate
                            <ArrowUpRight className="ml-2 text-green-400" size={28} />
                        </h2>
                        <p className="text-base sm:text-lg">
                            See emissions by channel and campaign, and spot the biggest impact areas.
                        </p>
                    </div>
                    <div className="w-full lg:w-4/5">
                        <div className="relative bg-gradient-to-r from-red-900 to-purple-900 rounded-lg lg:rounded-full p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/dashboard-chart.jpg"
                                alt="Description"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Step 2 - Analyze */}
                <div className="flex flex-col lg:flex-row items-center mb-12 lg:mb-16">
                    <div className="w-full lg:w-1/5 mb-6 lg:mb-0  text-center lg:text-left">
                        <div className="text-sm text-black mb-2">Step 2</div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 flex justify-center lg:justify-start items-center">
                            Analyze
                            <ArrowUpLeft className="ml-2 text-green-400" size={28} />
                        </h2>
                        <p className="text-base sm:text-lg">
                            See emissions by channel and campaign, and spot the biggest impact areas.
                        </p>
                    </div>
                    <div className="w-full lg:w-4/5">
                        <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg lg:rounded-full p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/green-moss.jpg"
                                alt="Description"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Step 3 - Offset */}
                <div className="flex flex-col lg:flex-row items-center mb-12 lg:mb-16">
                    <div className="w-full lg:w-1/5 mb-6 lg:mb-0 lg:pr-8 text-center lg:text-left">
                        <div className="text-sm text-black mb-2">Step 3</div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 flex justify-center lg:justify-start items-center">
                            Offset
                            <ArrowUpRight className="ml-2 text-green-400" size={28} />
                        </h2>
                        <p className="text-base sm:text-lg">
                            Choose verified projects to balance your footprint and support climate action.
                        </p>
                    </div>
                    <div className="w-full lg:w-4/5">
                        <div className="relative bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg lg:rounded-full p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/abstract-gray.jpg"
                                alt="Description"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Step 4 - Certify */}
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="w-full lg:w-1/5 mb-6 lg:mb-0  text-center lg:text-left">
                        <div className="text-sm text-black mb-2">Step 4</div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 flex justify-center lg:justify-start items-center">
                            Certify
                            <ArrowUpLeft className="ml-2 text-green-400" size={28} />
                        </h2>
                        <p className="text-base sm:text-lg">
                            Earn verified certification and showcase your progress with clients and partners.
                        </p>
                    </div>
                    <div className="w-full lg:w-4/5">
                        <div className="relative bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg lg:rounded-full p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/abstract-gray.jpg"
                                alt="Description"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
