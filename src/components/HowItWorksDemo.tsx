"use client"
import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Calculator, BarChart3, Zap, Award, TrendingDown, Target, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Calculate",
      subtitle: "Get the full picture",
      description: "Track emissions across all marketing channels in real-time. Our advanced algorithms analyze everything from digital ad spend to print materials, giving you precise carbon footprint data you can trust.",
      metrics: { value: "2.3M", label: "kg CO₂ tracked" },
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r border-tertiary/20",
    },
    {
      step: 2,
      title: "Report", 
      subtitle: "Find what matters most",
      description: "Discover which campaigns drive the highest emissions and identify quick wins. Our AI-powered insights reveal hidden patterns and suggest immediate optimization opportunities.",
      metrics: { value: "47%", label: "avg. reduction" },
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 border-tertiary/20",
    },
    {
      step: 3,
      title: "Offset",
      subtitle: "Cut where it counts",
      description: "Implement targeted strategies to reduce your marketing footprint without compromising performance. Get personalized recommendations based on your industry and campaign types.",
      metrics: { value: "15 days", label: "to see results" },
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r border-tertiary/20",
    },
    {
      step: 4,
      title: "Certification",
      subtitle: "Show your commitment", 
      description: "Earn verified sustainability credentials that resonate with eco-conscious customers. Build trust through transparent reporting and industry-recognized certifications.",
      metrics: { value: "98%", label: "client satisfaction" },
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none border-tertiary/20",
    },
  ];

  return (
    <div className="relative z-20 py-10  max-w-7xl mx-auto ">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
          How CarbonCut Works in{" "}
          <span className="text-orange-500">4 Simple Steps</span>
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-gray-600 text-center font-normal">
          From calculating your carbon footprint to earning sustainability certifications, 
          CarbonCut makes reducing marketing emissions simple and effective.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-tertiary/30 bg-white/50 backdrop-blur-sm">
          {steps.map((step) => (
            <FeatureCard key={step.title} className={step.className}>
              <FeatureTitle>
                <span >Step {step.step}:</span>
                <span className="text-tertiary"> {step.title}</span>
              </FeatureTitle>
              <FeatureSubtitle >
                <span className="text-orange-500">{step.subtitle}</span>
              </FeatureSubtitle>
              <FeatureDescription>{step.description}</FeatureDescription>
              <FeatureMetrics metrics={step.metrics} />
              <div className="h-full w-full">{step.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden hover:bg-green-50/50 transition-colors duration-300`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black text-xl md:text-2xl md:leading-snug font-bold mb-2">
      {children}
    </p>
  );
};

const FeatureSubtitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-tertiary font-semibold text-sm mb-3">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className={cn(
      "text-sm md:text-base max-w-4xl text-left mx-auto",
      "text-gray-600 font-normal",
      "text-left max-w-sm mx-0 md:text-sm my-2 leading-relaxed"
    )}>
      {children}
    </p>
  );
};

const FeatureMetrics = ({ metrics }: { metrics: { value: string; label: string } }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-tertiary/10 px-3 py-1 rounded-full mb-4">
      <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
      <span className="text-tertiary font-bold text-sm">{metrics.value}</span>
      <span className="text-gray-600 text-xs">{metrics.label}</span>
    </div>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-gradient-to-br from-green-50 to-white shadow-2xl group h-full rounded-lg border border-tertiary/20">
        <div className="flex flex-1 w-full h-full flex-col space-y-4">
          {/* Carbon Calculator Dashboard */}
          <div className="bg-tertiary/10 rounded-lg p-4 border border-tertiary/20">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-tertiary" />
              <span className="font-semibold text-gray-800">Live Carbon Tracking</span>
            </div>
            <div className="space-y-3">
              {[
                { channel: "Digital Ads", emissions: "1,245 kg", width: "w-16" },
                { channel: "Print Materials", emissions: "892 kg", width: "w-12" },
                { channel: "Video Production", emissions: "2,156 kg", width: "w-20" },
                { channel: "Events", emissions: "687 kg", width: "w-10" },
              ].map((item, idx) => (
                <motion.div 
                  key={item.channel}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`h-2 ${item.width} bg-orange-400 rounded-full`}></div>
                  <span className="text-sm text-gray-600 flex-1">{item.channel}</span>
                  <span className="text-sm font-bold text-tertiary">{item.emissions} CO₂</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total Emissions</span>
                <span className="font-bold text-lg text-tertiary">4,980 kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonTwo = () => {
  const campaigns = [
    { name: "Summer Campaign", reduction: 35, color: "bg-orange-500" },
    { name: "Brand Awareness", reduction: 22, color: "bg-orange-500" },
    { name: "Product Launch", reduction: 18, color: "bg-orange-500" },
    { name: "Holiday Promo", reduction: 45, color: "bg-orange-500" },
  ];

  return (
    <div className="relative flex flex-col items-start p-6 gap-4 h-full overflow-hidden">
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-tertiary" />
          <span className="font-semibold text-gray-800">Campaign Analysis</span>
        </div>
        
        {campaigns.map((campaign, idx) => (
          <motion.div
            key={campaign.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg p-3 border border-tertiary/20 shadow-sm hover:shadow-md transition-all duration-200 hover:border-tertiary/40"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800 text-sm">{campaign.name}</span>
              <span className="text-sm font-bold text-tertiary">-{campaign.reduction}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${campaign.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${campaign.reduction}%` }}
                transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white to-transparent h-full pointer-events-none" />
    </div>
  );
};
// ...existing code...

export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/image">
      <div className="w-full mx-auto bg-gradient-to-br from-green-50 to-white group h-full rounded-lg border border-orange-500 p-6">
        <div className="flex flex-1 w-full h-full flex-col items-center justify-center space-y-6">
          {/* Optimization Center */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto border-4 border-orange-500">
                <Zap className="w-10 h-10 text-orange-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-500">15 Days</div>
              <div className="text-sm text-gray-600">to see results</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {[
              { label: "Efficiency", value: "+32%", color: "text-tertiary" },
              { label: "Cost Savings", value: "$12K", color: "text-tertiary" },
              { label: "CO₂ Reduced", value: "2.1T", color: "text-orange-500" }, // orange metric
              { label: "ROI", value: "340%", color: "text-tertiary" },
            ].map((metric, idx) => (
              <motion.div 
                key={metric.label}
                className="bg-white rounded-lg p-3 text-center border border-tertiary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`font-bold text-sm ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-gray-500">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-tertiary/10 rounded-lg p-4 border-2 border-orange-500 text-center">
          <Award className="w-8 h-8 text-tertiary mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">Sustainability Certified</div>
          <div className="text-xs text-gray-600">98% Client Satisfaction</div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1,2,3,4,5].map((star, i) => (
              <CheckCircle 
                key={star} 
                className={`w-3 h-3 ${i === 0 ? "text-orange-500" : "text-tertiary"}`} 
              />
            ))}
          </div>
        </div>
      </div>
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.2, 0.8, 0.2], // Green base
      markerColor: [0, 0.8, 0.2], // Tertiary green
      glowColor: [0.2, 1, 0.4], // Green glow
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.06 },
        { location: [-33.8688, 151.2093], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};