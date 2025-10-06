import { Calculator, ClipboardList, TreePine } from 'lucide-react';
import React from 'react';
import { BlurFade } from '../ui/blur-fade';
import { Grid } from '../features-section-demo-1';

const WhyCarbonCut = () => {
  const reasons = [
    {
      icon: Calculator,
      title: "Accurate Carbon Calculation",
      description: "Quantify campaign and operational emissions with precision, including Scope 3 impacts, using methodologies aligned with recognised standards.",
    },
    {
      icon: ClipboardList,
      title: "Transparent Reporting",
      description: "Generate clear, audit-ready reports structured for ESG, SECR, SEC, and CSRD disclosure — built for finance, sustainability, and compliance teams.",
    },
    {
      icon: TreePine,
      title: "Verified Carbon Offsetting",
      description: "Neutralise tonnes of carbon through certified projects across nature, energy, waste and others,  each linked to a transparent certificate trail and smart-contract record.",
    },
  ];

  return (
    <div className="relative z-20 pt-20 max-w-7xl mx-auto">
      <div className="px-8">
        {/* Title */}
        <BlurFade delay={0.1} inView>
        <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
            Security, Reliability,<span className='text-tertiary'> Simplicity </span> 
          </h2>
          <p className="text-lg lg:text-xl max-w-4xl mx-auto text-gray-600 text-center font-normal mb-12">
           A platform built for leaders who need  <span className="text-orange-500">carbon data they can trust.</span> CarbonCut ensures your marketing emissions are measured with accuracy, reported with transparency, and offset with compliant and globally verified credits.

          </p>
        </BlurFade>

        {/* Reasons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-4 pb-10">
          {reasons.map((feature, index) => (
            <BlurFade
              key={feature.title}
              delay={index * 0.2}
              inView
              className="group relative bg-gray-100 p-6 rounded-3xl overflow-hidden border border-green-100 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md"
            >
              <Grid size={20} />

              <div className="relative z-20 mb-4 ">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-tertiary/10 group-hover:bg-tertiary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-tertiary" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 relative z-20 mb-3 group-hover:text-black transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm font-normal relative z-20 leading-relaxed group-hover:text-gray-700 transition-colors">
                {feature.description}
              </p>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyCarbonCut;
