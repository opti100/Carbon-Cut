"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calculator, BarChart3, Download, Award, PlugZap, GitPullRequestDraft, CalendarSync, ShieldCheck, LucideProps } from "lucide-react";

interface Step {
    step: number;
    title: string;
    subtitle: string;
    description: string;
    metrics: { label: string };
    image?: string;
    icon: React.ComponentType<LucideProps>;
}

const steps: Step[] = [
    {
        step: 1,
        title: "Connect",
        subtitle: "Integrate once — measure forever",
        description: "Connect your ad platforms, data streams, or infrastructure once. CarbonLive immediately begins real-time CO₂e tracking across servers, delivery networks, and data transfers — using live grid-intensity data and verified emission factors.",
        metrics: { label: "Instant integration, instant visibility" },
        image: "/how-it-works/connect.jpg",
        icon: PlugZap
    },
    {
        step: 2,
        title: "Monitor",
        subtitle: "Real-time insights you can act on",
        description: "View live CO₂e totals, forecasted footprints, and AI-agent recommendations for immediate emission reduction — all mapped to GHG Protocol categories.",
        metrics: { label: "Live dashboards. Instant accountability." },
        image: "/how-it-works/monitor.jpg",
        icon: GitPullRequestDraft
    },
    {
        step: 3,
        title: "Auto-Offset",
        subtitle: "Residuals retired automatically",
        description: "When emissions hit a defined threshold or a campaign ends, CarbonLive automatically retires verified carbon credits from approved registries such as Verra, Gold Standard, ACR.",
        metrics: { label: "Verified offsets, executed automatically." },
        image: "/how-it-works/offset.jpg",
        icon: CalendarSync
    },
    {
        step: 4,
        title: "Certify & Share",
        subtitle: "Proof you can publish",
        description: "Every offset completed through CarbonLive generates a measure-linked certificate and on-chain reference hash, providing finance teams, auditors, and clients with verifiable proof of real-time emission control and neutrality.",
        metrics: { label: "Transparent data. Trusted results." },
        image: "/how-it-works/certify.jpg",
        icon: ShieldCheck
    },

];

const SkeletonOne = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-3 lg:p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-3 lg:space-y-4">
                    <div className="bg-[#d1cebb]/20 rounded-lg p-3 lg:p-4 border border-[#d1cebb]/40">
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <Calculator className="w-4 h-4 lg:w-5 lg:h-5 text-[#6c5f31]" />
                            <span className="font-semibold text-[#080c04] text-xs lg:text-sm">XYZ Campaign (01.08.2025)</span>
                        </div>
                        <div className="space-y-2 lg:space-y-3">
                            {[{
                                channel: "DSP Connected:", emissions: "Google DV360", width: "w-8 lg:w-12"
                            },
                            {
                                channel: "Impressions:", emissions: "60,000,000", width: "w-6 lg:w-10"
                            },
                            {
                                channel: "Active UTM:", emissions: "480", width: "w-10 lg:w-16"
                            }].map((item, idx) => (
                                <motion.div
                                    key={item.channel}
                                    className="flex items-center gap-2 lg:gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className={`h-1.5 lg:h-2 ${item.width} bg-[#b0ea1d] rounded-full`}></div>
                                    <span className="text-[10px] lg:text-xs text-[#6c5f31] flex-1">{item.channel}</span>
                                    <span className="text-[10px] lg:text-xs font-bold text-[#080c04]">{item.emissions}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-[#d1cebb]">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-[#080c04] text-xs lg:text-sm">Carbon Emission:</span>
                                <span className="font-bold text-sm lg:text-base text-[#b0ea1d]">40.2 Mt CO2e</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonTwo = () => {
    const campaigns = [
        { name: "Summer Launch: Relocate ad server region", reduction: 3.2, color: "bg-[#b0ea1d]" },
        { name: "Always-On Digital: Optimise campaign split", reduction: 2.5, color: "bg-[#b0ea1d]" },
        { name: "Holiday Promotions: Reduce redundant ad sets", reduction: 1.8, color: "bg-[#b0ea1d]" },
    ];

    const maxReduction = Math.max(...campaigns.map(c => c.reduction));

    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-3 lg:p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center gap-2 mb-3 lg:mb-4">
                        <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-[#6c5f31]" />
                        <span className="font-semibold text-[#080c04] text-xs lg:text-sm">AI agents reduction tasks</span>
                    </div>

                    {campaigns.map((campaign, idx) => {
                        const barWidth = (campaign.reduction / maxReduction) * 100;

                        return (
                            <motion.div
                                key={campaign.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#d1cebb]/10 rounded-lg p-2 lg:p-3 border border-[#d1cebb]/40 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-1 lg:mb-2">
                                    <span className="font-medium text-[#080c04] text-[10px] lg:text-xs">{campaign.name}</span>
                                    <span className="text-[10px] lg:text-xs font-bold text-[#b0ea1d]">-{campaign.reduction}tCO₂e</span>
                                </div>
                                <div className="w-full bg-[#d1cebb]/30 rounded-full h-1.5 lg:h-2">
                                    <motion.div
                                        className={`h-1.5 lg:h-2 rounded-full ${campaign.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${barWidth}%` }}
                                        transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SkeletonThree = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-3 lg:p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-3 lg:space-y-4">
                    <div className="text-center pb-2 lg:pb-3 border-b border-[#d1cebb]">
                        <h3 className="text-sm lg:text-base font-bold text-[#080c04]">Retirement Summary</h3>
                    </div>

                    <div className="bg-[#d1cebb]/10 rounded-xl p-3 lg:p-4 border border-[#d1cebb]/40 shadow-sm space-y-2 lg:space-y-3">
                        <div className="space-y-1.5 lg:space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] lg:text-xs text-[#6c5f31] font-medium">Campaign:</span>
                                <span className="text-[10px] lg:text-xs font-semibold text-[#080c04] text-right">
                                    Always-On Display Q4
                                </span>
                            </div>

                            <div className="flex justify-between items-start pt-1.5 lg:pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs text-[#6c5f31] font-medium">Residual Emissions:</span>
                                <span className="text-[10px] lg:text-xs text-[#b0ea1d] font-semibold">1.26 tCO₂e</span>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 lg:pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs text-[#6c5f31] font-medium">Offset Project:</span>
                                <span className="text-[10px] lg:text-xs font-bold text-[#080c04]">Indonesia Mangrove (GS)</span>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 lg:pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs text-[#6c5f31]">Retirement ID:</span>
                                <span className="text-[10px] lg:text-xs font-mono font-semibold text-[#080c04] bg-[#d1cebb]/20 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded">
                                    GS-984-212-B77
                                </span>
                            </div>
                        </div>

                        <div className="pt-1.5 lg:pt-2">
                            <button className="w-full bg-[#b0ea1d] hover:bg-[#F0db18] text-[#080c04] font-semibold py-1.5 lg:py-2 px-3 lg:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 lg:gap-2 shadow-md text-[10px] lg:text-xs">
                                <Download className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                                Download Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonFour = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-3 lg:p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-3 lg:space-y-4">
                    <div className="bg-[#d1cebb]/10 rounded-lg p-3 lg:p-4 border border-[#d1cebb]/40">
                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                            <Award className="w-4 h-4 lg:w-5 lg:h-5 text-[#6c5f31]" />
                            <span className="font-semibold text-[#080c04] text-xs lg:text-sm">Certificate Snippet</span>
                        </div>

                        <div className="space-y-1.5 lg:space-y-2">
                            <div className="flex justify-between items-center pb-1.5 lg:pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs font-medium text-[#6c5f31]">Certified Campaign:</span>
                                <span className="text-xs lg:text-sm font-bold text-[#080c04]">Brand Awareness Q3</span>
                            </div>

                            <div className="flex justify-between items-center pb-1.5 lg:pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs font-medium text-[#6c5f31]">Total CO₂e Neutralised:</span>
                                <span className="text-xs lg:text-sm font-bold text-[#b0ea1d]">4.9 tCO₂e</span>
                            </div>

                            <div className="flex justify-between items-center pb-1.5 lg:pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs font-medium text-[#6c5f31]">Issued:</span>
                                <span className="text-[10px] lg:text-xs font-semibold text-[#080c04]">15 October 2025</span>
                            </div>

                            <div className="flex justify-between items-center pb-1.5 lg:pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-[10px] lg:text-xs font-medium text-[#6c5f31]">Certificate ID:</span>
                                <span className="text-[10px] lg:text-xs font-bold text-[#080c04]">CC-BAQ3-2025</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] lg:text-xs font-medium text-[#6c5f31]">On-Chain Reference:</span>
                                <span className="text-[10px] lg:text-xs font-bold text-[#080c04]">Hash #0x8aF9…D12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const stepComponents = [SkeletonOne, SkeletonTwo, SkeletonThree, SkeletonFour];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const fieldsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const sectionTop = sectionRef.current.offsetTop;
            const sectionHeight = sectionRef.current.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress through the section (0 to 1)
            const progress = Math.max(0, Math.min(1,
                (scrollY - sectionTop + windowHeight * 0.5) / sectionHeight
            ));
            setScrollProgress(progress);

            // Slower step progression - requires more scrolling between steps
            // Each step now requires ~8-10 scroll actions to progress
            const stepProgress = progress * 4; // 0 to 4
            const stepIndex = Math.min(Math.floor(stepProgress), 3); // 0, 1, 2, or 3

            setActiveStep(stepIndex);
        };

        // Throttle scroll events for smoother experience
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", scrollHandler);
        handleScroll();

        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-10 overflow-clip bg-[#fcfdf6]"
            id="what-we-do"
            aria-label="What We Do"
            style={{ "--progress": scrollProgress } as React.CSSProperties}
        >
            {/* Mobile Layout - Simple Vertical */}
            <div className="block lg:hidden">
                {/* Mobile Header */}
                <div className="px-4 py-6 lg:py-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#60be03] text-center mb-2">
                        How it works
                    </h2>
                    <p className="text-sm sm:text-base text-[#6c5f31] text-center max-w-2xl mx-auto">
                        CarbonLive measures, reduces, and offsets emissions in real time
                    </p>
                </div>

                {/* Mobile Steps */}
                <div className="space-y-6 lg:space-y-8 px-4 pb-8 lg:pb-12">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div key={index} className="space-y-3 lg:space-y-4">
                                {/* Step Content */}
                                <div className="bg-white rounded-lg border border-[#d1cebb]/40 p-3 lg:p-4">
                                    <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                                        <div className="shrink-0 font-bold font-mono text-base lg:text-lg text-[#6c5f31]">
                                            0{step.step}
                                        </div>
                                        
                                        {/* Icon Component - Mobile */}
                                        <div className="relative h-6 w-6 lg:h-8 lg:w-8">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 40 40"
                                                className="icons-outline absolute inset-0 text-[#6c5f31] transition-transform duration-1000"
                                            >
                                                <path d="M1 32.653V39h6.347v1H0v-7.347zm39 0V40h-7.347v-1H39v-6.347zM7.347 0v1H1v6.347H0V0zM40 0v7.347h-1V1h-6.347V0z" />
                                            </svg>
                                            
                                            {/* Sliding Icon */}
                                            <div 
                                                className="absolute inset-0 inline-flex overflow-hidden transition-transform duration-500"
                                                style={{
                                                    transform: "translateX(0)",
                                                    opacity: 1
                                                }}
                                            >
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#b0ea1d] rounded-full flex items-center justify-center shrink-0">
                                                    <IconComponent className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-base lg:text-lg font-bold text-[#080c04]">
                                                {step.title}
                                            </h3>
                                            <p className="text-xs lg:text-sm text-[#6c5f31] font-medium">
                                                {step.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs lg:text-sm text-[#6c5f31]/80 leading-relaxed mb-2 lg:mb-3">
                                        {step.description}
                                    </p>
                                    
                                    <div className="inline-block bg-[#b0ea1d]/10 border border-[#b0ea1d]/30 rounded-full px-2.5 lg:px-3 py-1">
                                        <span className="text-[10px] lg:text-xs font-semibold text-[#6c5f31]">
                                            {step.metrics.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Skeleton Component */}
                                <div className="h-48 sm:h-56 lg:h-64">
                                    {stepComponents[index] && stepComponents[index]()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Layout - Original Parallax */}
            <div className="hidden lg:block">
                <div className="prllx-wrapper relative flex h-[1600lvh] flex-row overflow-clip">
                    {/* Left Side - Sticky Fields */}
                    <div className="fields-sticky sticky top-0 z-10 h-lvh w-1/2 flex items-center justify-center">
                        {/* Dashed Grid Background with Parallax Movement */}
                        <div
                            className="absolute top-0 -z-10 left-10 xl:left-20 h-full mb-40 w-4 text-[#fdcf29]"
                            style={{
                                opacity: 0.5,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M 0 0 L 10 0 M 0 0 L 0 10' stroke='currentColor' stroke-dasharray='2 2' stroke-width='1' vector-effect='non-scaling-stroke'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundSize: "1em 1em",
                                backgroundPosition: `center calc(50% - ${scrollProgress * 2000}px)`
                            }}
                        />

                        {/* Fields Container */}
                        <div
                            ref={fieldsRef}
                            className="relative w-full max-w-xl xl:max-w-2xl px-4 xl:px-6 ml-8 xl:ml-12"
                        >
                            <ul className="fields-wrapper relative flex w-full">
                                {steps.map((step, index) => {
                                    const isActive = activeStep === index;
                                    const IconComponent = step.icon;
                                    const rotationDegrees = isActive ? 720 : (index < activeStep ? 720 : 0);

                                    return (
                                        <li
                                            key={index}
                                            className="absolute inset-0 flex flex-col justify-center w-full transition-opacity duration-700"
                                            style={{
                                                opacity: isActive ? 1 : 0,
                                                pointerEvents: isActive ? 'auto' : 'none'
                                            }}
                                        >
                                            <div className="flex items-start gap-6 xl:gap-8 ml-4 xl:ml-6">
                                                {/* Step Number */}
                                                <div className="shrink-0 font-medium font-mono text-xs xl:text-sm text-[#6c5f31]">
                                                    <div>0{step.step}</div>
                                                </div>

                                                {/* Step Content */}
                                                <div className="flex-1 flex flex-col items-start gap-2 xl:gap-4 pl-2 xl:pl-4">
                                                    {/* Icon Component - Desktop */}
                                                    <div className="relative h-8 w-8 xl:h-10 xl:w-10 ml-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 40 40"
                                                            className="icons-outline absolute inset-0 text-[#6c5f31] transition-transform duration-1000"
                                                            style={{ transform: `rotate(${rotationDegrees}deg)` }}
                                                        >
                                                            <path d="M1 32.653V39h6.347v1H0v-7.347zm39 0V40h-7.347v-1H39v-6.347zM7.347 0v1H1v6.347H0V0zM40 0v7.347h-1V1h-6.347V0z" />
                                                        </svg>
                                                        
                                                        {/* Sliding Icon */}
                                                        <div 
                                                            className="absolute inset-0 inline-flex overflow-hidden transition-transform duration-500"
                                                            style={{
                                                                transform: isActive ? "translateX(0)" : "translateX(-100%)",
                                                                opacity: isActive ? 1 : 0
                                                            }}
                                                        >
                                                            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-[#b0ea1d] rounded-full flex items-center justify-center shrink-0">
                                                                <IconComponent className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Title with Double Layer Reveal */}
                                                    <h2 className="overflow-clip font-medium text-2xl xl:text-4xl text-[#080c04] mb-1 ml-1">
                                                        <div
                                                            className="title-wrapper relative flex flex-col transition-transform duration-700"
                                                            style={{
                                                                transform: isActive ? "translateY(-100%)" : "translateY(0)"
                                                            }}
                                                        >
                                                            <span className="absolute top-full left-0">{step.title}</span>
                                                            <span>{step.title}</span>
                                                        </div>
                                                    </h2>

                                                    {/* Subtitle */}
                                                    <p className="text-base xl:text-lg font-semibold text-[#6c5f31] mb-1 xl:mb-2 ml-1">
                                                        {step.subtitle}
                                                    </p>

                                                    {/* Description */}
                                                    <p className="text-sm xl:text-base text-[#6c5f31]/80 leading-relaxed mb-2 xl:mb-4 ml-1">
                                                        {step.description}
                                                    </p>

                                                    {/* Metrics Badge */}
                                                    <div className="inline-block bg-[#b0ea1d]/10 border border-[#b0ea1d]/30 rounded-full px-3 xl:px-4 py-1.5 xl:py-2 ml-1">
                                                        <span className="text-xs xl:text-sm font-semibold text-[#6c5f31]">
                                                            {step.metrics.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Sticky Animation/Image Panel */}
                    <div className="absolute top-0 right-0 z-0 h-full w-1/2">
                        <div className="w-full flex justify-end px-6 xl:px-10 py-8 xl:py-12">
                            <div className="max-w-lg xl:max-w-2xl text-end">
                                <h2 className="text-4xl xl:text-6xl font-bold tracking-tight text-[#d1cebb] leading-tight mb-3 xl:mb-4">
                                    How it works
                                </h2>

                                <p className="text-base xl:text-lg text-[#080c04]/80 leading-relaxed">
                                    CarbonLive measures, reduces, and offsets emissions in real time — starting with
                                    internet advertising and expanding to energy and gas sectors.
                                </p>
                            </div>
                        </div>

                        <div className="anim-wrapper sticky top-0 left-0 h-lvh w-full">
                            <div className="anim-bg-wrapper absolute inset-0">
                                {steps.slice(0, 4).map((step, index) => (
                                    <div
                                        key={index}
                                        className="anim-bg-img absolute inset-0 transition-opacity duration-700"
                                        style={{
                                            opacity: activeStep === index ? 1 : 0,
                                            visibility: activeStep === index ? "visible" : "hidden"
                                        }}
                                    >
                                        {stepComponents[index] && stepComponents[index]()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
