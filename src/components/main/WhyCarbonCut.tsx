import { Calculator, ClipboardList, TreePine } from 'lucide-react';
import React from 'react'
import { HeroHighlight, Highlight } from '../ui/hero-highlight';
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

                <BlurFade delay={0.1} inView>
                    <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
                    Why <span className="text-tertiary">CarbonCut?</span>
                </h4>
                </BlurFade>
                <BlurFade delay={0.5} inView>
                <div className="mb-16 h-auto py-12 px-6 lg:px-12 bg-[#FFD02F] rounded-3xl mt-12">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-orange-500 mb-6">
                            {/* <Highlight className="text-black"> */}
                                Security, Reliability, Simplicity
                            {/* </Highlight> */}
                        </h2>
                        <p className="text-lg lg:text-xl max-w-4xl mx-auto text-gray-600 text-center font-normal mb-12">
                            A trusted platform to measure, report, and offset carbon emissions with reliable data, clear insights, and globally verified projects that drive real climate impact.
                        </p>
                    </div>
                </div>
                </BlurFade>
            </div>
        </div>
    )
}

export default WhyCarbonCut