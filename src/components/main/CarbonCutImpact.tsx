import React from 'react';
import { BlurFade } from '../ui/blur-fade';
import { HyperText } from '../ui/hyper-text';

const CarbonCutImpact = () => {
  return (
    <div className="w-full bg-gray-50 py-16">
      {/* Centered container */}
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <BlurFade delay={0.1} inView className="text-center mb-16">
            <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
              Our Impact & Expertise at a <span className='text-tertiary'>Glance</span>
            </h2>
             
            <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
              A trusted platform to measure, report, and offset carbon emissions with reliable data, clear insights, and globally 
              verified projects that drive real climate impact.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-tertiary rounded-lg p-8 mb-4 shadow-sm">
              <HyperText inView animateOnHover={false} className="text-3xl font-bold text-gray-900 mb-2">
                500K+
              </HyperText>
              <div className="text-gray-700 text-sm font-medium">
                Tons of CO2e emissions<br />calculated to date
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8 mb-4 shadow-sm">
              <HyperText inView delay={100} animateOnHover={false} className="text-3xl font-bold text-gray-900 mb-2">
                $5 Million
              </HyperText>
              <div className="text-gray-600 text-sm font-medium">
                In verified carbon credits<br />transacted
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8 mb-4 shadow-sm">
              <HyperText inView delay={200} animateOnHover={false} className="text-4xl font-bold text-gray-900 mb-2">
                150+
              </HyperText>
              <div className="text-gray-600 text-sm font-medium">
                Globally verified offset<br />projects supported
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8 mb-4 shadow-sm">
              <HyperText inView delay={300} animateOnHover={false} className="text-4xl font-bold text-gray-900 mb-2">
                50+
              </HyperText>
              <div className="text-gray-600 text-sm font-medium">
                Globally verified offset<br />projects supported
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">~15%</div>
            <div className="text-gray-600 text-sm font-medium">
              Average emission reduction<br />achieved by our users
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">10+ Years</div>
            <div className="text-gray-600 text-sm font-medium">
              Average team experience in<br />climate tech & sustainability
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">Minutes</div>
            <div className="text-gray-600 text-sm font-medium">
              To calculate a comprehensive<br />carbon footprint
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">ESG-Ready</div>
            <div className="text-gray-600 text-sm font-medium">
              Reports compliant with<br />leading sustainability<br />standards
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarbonCutImpact;
