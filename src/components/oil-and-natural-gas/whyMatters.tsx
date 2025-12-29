"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useRef } from "react";

export default function WhyItMatters() {
    const imageRef = useRef<HTMLDivElement>(null);

    // enable smooth scroll with parallax effect
    useLenis(({ scroll }) => {
        if (imageRef.current) {
            const speed = 0.5; // adjust for parallax intensity
            const y = scroll * speed;
            imageRef.current.style.transform = `translateY(${y}px)`;
        }
    });

    return (
        <section className="w-full min-h-screen bg-[#F4F1DE] flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-10 py-20">

                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center space-y-8">

                    <p className="text-center lg:text-left text-sm tracking-widest text-[#9b6a3c]">
                        PRIMLAND RESIDENCES
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif text-[#325342] leading-tight text-center lg:text-left">
                        Among Virginia's Blue Ridge mountains, a once-in-a-generation
                        residential community that reflects and celebrates 12,000 private
                        acres and the way of life they inspire.
                    </h1>

                    <div className="space-y-4">
                        <p className="text-xs tracking-wider text-[#9b6a3c]">
                            MAKING MEMORIES
                        </p>

                        <p className="uppercase text-[#325342] tracking-wide">
                            Stunning sunrises and sunsets from your porch. Stargazing and
                            s'mores by the fire. Hikes along picturesque trails. Thrilling
                            mountain bike rides.
                        </p>

                        <p className="text-[#325342]/80 max-w-xl">
                            On 12,000 acres where creeks and a river run. Where clouds kiss
                            mountaintops. Birds, trees, and wildflowers speak a language
                            you'll come to call your own.
                        </p>
                    </div>
                 
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-full h-[420px] lg:h-[520px] rounded-xl overflow-hidden">
                    <div ref={imageRef} className="w-full h-full transition-transform duration-100 ease-linear">
                        <Image
                            src="/auth-hero.jpg"
                            alt="Blue Ridge Mountains"
                            width={1200}
                            height={900}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
