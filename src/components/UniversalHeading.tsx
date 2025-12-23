"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const UniversalHeading = ({
    title,
    description,
    align = "right",
}: {
    title: string;
    description?: string;
    align?: "left" | "center" | "right";
}) => {
    const containerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const words = containerRef.current.querySelectorAll(".word");

        gsap.fromTo(
            words,
            { opacity: 0.1 },
            {
                opacity: 1,
                stagger: 0.2,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    end: "top 45%",
                    scrub: 1.5,
                },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <div
            className={`mt-20 max-w-7xl mx-auto px-4 mb-10 font-mono text-${align}`}
        >

            {/* DESCRIPTION */}
            {description && (
                <p
                    className="
            
           
            text-[#6c5f31]
            text-sm
            sm:text-base
            md:text-sm
            leading-relaxed
            opacity-80
            ml-auto
          "
                >
                    {description}
                </p>
            )}

            {/* TITLE */}
            <h1
                ref={containerRef}
                className="
          font-bold
          text-[#6c5f31]
          leading-[1.15]
          text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          xl:text-5xl
        "
            >
                {title.split(" ").map((word, i) => (
                    <span
                        key={i}
                        className="word inline-block opacity-20 tracking-tight sm:tracking-normal"
                    >
                        {word}
                        {i < title.split(" ").length - 1 ? "\u00A0" : ""}
                    </span>

                ))}
            </h1>


        </div>
    );
};

export default UniversalHeading;
