import React from 'react';
import { BlurFade } from '../ui/blur-fade';
import { HyperText } from '../ui/hyper-text';

const CarbonCutImpact = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <BlurFade delay={0.1} inView className="text-center">
            <h2 className="text-3xl lg:text-5xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
              Our Impact & Expertise at a <span className="text-tertiary">Glance</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
              A trusted platform to {" "}
               <span className="text-orange-500 font-semibold">measure,</span> 
               <span className="text-orange-500 font-semibold">report,</span>  and{" "}
               <span className="text-orange-500 font-semibold">offset</span>  {" "}
               carbon emissions with reliable data, clear insights, and globally verified projects that drive real climate impact.
            </p>
          </BlurFade>
        </div>

        {/* Top 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'First of Its Kind',
              desc: 'World’s first CliMarTech platform for marketing emissions',
              bg: 'bg-tertiary',
              text: 'text-black',
              delay: 0,
            },
            {
              title: 'Scope 3 Ready',
              desc: 'Purpose-built to address the biggest blind spot in advertising carbon',
              bg: 'bg-gray-50',
              text: 'text-gray-900',
              delay: 100,
            },
            {
              title: 'Audit-Ready',
              desc: 'Reports aligned with SECR (UK), SEC (US), CSRD (EU) disclosure frameworks',
              bg: 'bg-gray-50',
              text: 'text-gray-900',
              delay: 200,
            },
            {
              title: 'Verified Path',
              desc: 'Every tonne tied to a certificate trail + smart-contract record',
              bg: 'bg-gray-50',
              text: 'text-gray-900',
              delay: 300,
            },
          ].map((card, idx) => (
            <div key={idx} className="text-center h-full">
              <div
                className={`${card.bg} rounded-lg p-6 mb-4 shadow-sm transform transition-transform hover:scale-105 flex flex-col h-full`}
              >
                <HyperText
                  inView
                  delay={card.delay}
                  animateOnHover={false}
                  className="font-sans text-3xl font-bold leading-tight tracking-tight mb-2 normal-case"
                  style={{ textTransform: 'none' }}
                >
                  {card.title}
                </HyperText>
                <div className={`text-sm font-medium ${card.text} flex-1`}>
                  {card.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[
            { label: '~Minutes, Not Months', desc: 'To calculate a campaign-level footprint' },
            { label: '10+ Years', desc: 'Marketing and sustainability expertise behind the platform' },
            { label: 'Built for Marketing', desc: 'Created by marketers, for marketing & advertising emissions' },
            { label: 'Trusted', desc: 'Designed for transparency, compliance and climate integrity' },
          ].map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.label}</div>
              <div className="text-gray-600 text-sm font-medium">{metric.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarbonCutImpact;
