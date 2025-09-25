import { Calculator, ClipboardList, TreePine } from 'lucide-react';
import React from 'react'
import { BlurFade } from '../ui/blur-fade';

const WhyCarbonCut = () => {
    const reasons = [
        {
            icon: Calculator,
            title: "Accurate Carbon Calculation",
            description: "Measure emissions with precision across campaigns and operations.",
        },
        {
            icon: ClipboardList,
            title: "Transparent Reporting",
            description: "Get clear, auditable reports aligned with ESG standards.",
        },
        {
            icon: TreePine,
            title: "Verified Carbon Offsetting",
            description: "Support certified projects that deliver real climate impact.",
        },
    ];

    return (
        <div className="relative z-20 pt-20 max-w-7xl mx-auto">
            <div className="px-8">
                {/* Title */}
                <BlurFade delay={0.1} inView>
                    <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-gray-900">
                        Why <span className="text-gray-600 font-semibold">CarbonCut?</span>
                    </h4>
                </BlurFade>

                {/* Highlight Section */}
                <BlurFade delay={0.5} inView>
                    <div className="mb-16 h-auto py-12 px-6 lg:px-12 bg-gray-100 rounded-3xl mt-12">
                        <div className="text-center">
                            <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
                                Security, Reliability, Simplicity
                            </h2>
                            <p className="text-lg lg:text-xl max-w-4xl mx-auto text-gray-600 text-center font-normal mb-12">
                                A trusted platform to measure, report, and offset carbon emissions with reliable data, clear insights, and globally verified projects that drive real climate impact.
                            </p>
                        </div>
                    </div>
                </BlurFade>

                {/* Reasons Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {reasons.map((reason, idx) => (
                        <BlurFade key={reason.title} delay={0.6 + idx * 0.2} inView>
                            <div className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-200 text-gray-700 mb-6 mx-auto">
                                    <reason.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                                    {reason.title}
                                </h3>
                                <p className="text-gray-600 text-center text-base leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WhyCarbonCut;
