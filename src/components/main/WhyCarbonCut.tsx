import { Calculator, ClipboardList, TreePine } from 'lucide-react';
import React from 'react'
import { HeroHighlight, Highlight } from '../ui/hero-highlight';

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
        <div className="relative z-20 py-10  max-w-7xl mx-auto ">
            <div className="px-12">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
                    Why <span className="text-tertiary">CarbonCut?</span>
                </h4>
            </div>
            <HeroHighlight className="text-center mb-16">
                <h2 className="text-3xl lg:text-7xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-orange-500 mb-6">
                    Security, Reliability, Simplicity
                </h2>
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {reasons.map((reason, index) => (
                        <div key={reason.title} className="flex flex-col items-start text-left">
                            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-tertiary">
                                <reason.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3 leading-tight">
                                {reason.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div> */}
            </HeroHighlight>
        </div>
    )
}

export default WhyCarbonCut
