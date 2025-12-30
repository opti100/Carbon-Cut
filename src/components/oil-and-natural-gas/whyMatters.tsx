"use client";

import Image from "next/image";
import Link from "next/link";

export default function WhyItMatters() {
    return (
        <section className="w-full min-h-screen bg-[#fcfdf6] flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-10 py-20">

                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center space-y-8">
                    <p className="text-center lg:text-left text-sm tracking-widest text-[#6c5f31]">
                        Why It Matters
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif text-[#325342] leading-tight text-center lg:text-left">
                        Oil and gas operations generate complex and widespread carbon emissions that require accurate measurement and reporting to meet regulatory standards and ESG goals.
                    </h1>

                    <div className="space-y-4">


                        <p className="uppercase text-[#325342] tracking-wide">
                            Traditional methods miss key sources like methane leaks and flaring, leading to gaps in compliance and decarbonization
                        </p>

                        <div className="nav-right-section">
                            <Link href="/oil-and-natural-gas/lubricant" className="desktop-cta-link">
                                <button
                                    type="button"
                                    className="card-nav-cta-button"
                                    style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                                >
                                    Lubricant
                                </button>
                            </Link>
                        </div>


                    </div>
                </div>

                {/* RIGHT IMAGE — STICKY */}
                <div className="w-full h-[420px] lg:h-[520px] rounded-xl overflow-hidden sticky top-20">
                    <Image
                        src="/auth-hero.jpg"
                        alt="Blue Ridge Mountains"
                        width={1200}
                        height={900}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
