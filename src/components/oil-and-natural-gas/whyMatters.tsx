"use client";

import Image from "next/image";
import Link from "next/link";
import AnimatedHeading from "../internet/InternetHeading";

export default function WhyItMatters() {
    return (
        <section className="w-full min-h-screen bg-[#fcfdf6] flex items-center">
            <div className="max-w-7xl mx-auto w-full  px-6 lg:px-10 py-20">
                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center space-y-8">
                    <p className="text-center lg:text-left text-sm tracking-widest text-[#6c5f31]">
                        Why It Matters
                    </p>
                    <AnimatedHeading
                        text="Oil and gas operations generate complex and widespread carbon emissions that require accurate measurement and reporting to meet regulatory standards and ESG goals."
                        className="text-4xl md:text-5xl font-serif text-[#325342] leading-tight text-center lg:text-left"
                    />
                    <div className="space-y-4">
                        <p className="uppercase text-[#325342] tracking-wide">
                            Traditional methods miss key sources like methane leaks and flaring, leading to gaps in compliance and decarbonization
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
