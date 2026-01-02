"use client";

import { FileCheck2, Gauge, Leaf, Radar, Recycle } from "lucide-react";
import UniversalHeading from "../UniversalHeading";
import { PinContainer } from "../ui/3d-pin";
import Image from "next/image";
import Link from "next/link";

export default function Lubricant() {
    return (
        <section className="w-full h-[80vh] grid grid-cols-1 lg:grid-cols-[40%_60%]">
            {/* LEFT IMAGE */}
            <div className="h-full w-full">
                <img 
                    src="/article-2/article1.jpg"
                    alt="Interior space"
                    className="w-full h-full object-cover"
                />

           
            </div>

            {/* RIGHT CONTENT PANEL */}
            <div className="flex items-center justify-center bg-[#d1cebb] bg-[url('/texture.png')] bg-cover bg-blend-overlay px-6 md:px-12">
                <div className=" space-y-6 text-black">
                    <UniversalHeading title="Tracking & Reporting" align="left" />

                    <p className="text-sm md:text-base opacity-90 leading-relaxed">
                        We help organizations accurately measure and manage the carbon emissions associated with lubricants across their full lifecycle — from raw material extraction and blending to distribution, use, and end-of-life.
                    </p>

                    {/* <p className="text-sm md:text-base opacity-90 leading-relaxed">
            Track, Decarbon and Report - transforms complex carbon calculations into source-level, actionable insights. You get a clear picture of your digital carbon footprint, industry benchmarks to see how you stack up, and concrete recommendations to reduce emissions while maintaining performance.
          </p> */}


                    <ul>
                        <p className="text-md font-semibold md:text-base opacity-90 leading-relaxed">
                            What we Track
                        </p>

                        <li className="flex justify-start items-center">
                            <Recycle className="h-5 w-5 mr-2" />
                            <p className="text-sm md:text-base opacity-90 leading-relaxed">
                                Lifecycle-based carbon footprinting for lubricant products
                            </p>
                        </li>

                        <li className="flex justify-start items-center">
                            <Gauge className="h-5 w-5 mr-2" />
                            <p className="text-sm md:text-base opacity-90 leading-relaxed">
                                Product-level emissions intensity metrics
                            </p>
                        </li>

                        <li className="flex justify-start items-center">
                            <FileCheck2 className="h-5 w-5 mr-2" />
                            <p className="text-sm md:text-base opacity-90 leading-relaxed">
                                Data-backed ESG and regulatory reporting
                            </p>
                        </li>

                        <li className="flex justify-start items-center">
                            <Radar className="h-5 w-5 mr-2" />
                            <p className="text-sm md:text-base opacity-90 leading-relaxed">
                                Identification of emission hotspots across the value chain
                            </p>
                        </li>

                        <li className="flex justify-start items-center">
                            <Leaf className="h-5 w-5 mr-2" />
                            <p className="text-sm md:text-base opacity-90 leading-relaxed">
                                Support for low-carbon and alternative lubricant strategies
                            </p>
                        </li>
                    </ul>

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
        </section>
    );
}
