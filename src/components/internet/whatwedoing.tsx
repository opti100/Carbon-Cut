import AnimatedHeading from "./InternetHeading";

export default function WhatWeDoing() {
    return (
        <>
        <section className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#fcfdf6] my-4 md:my-8  overflow-hidden px-3 md:px-6">

            {/* LEFT CONTENT */}
            <div className="flex items-center px-6 md:px-16 bg-[#d1cebb] rounded-2xl">
                <div className="max-w-xl">
                    <AnimatedHeading
                        text="What We're Doing"
                        className="text-4xl font-semibold  md:text-5xl font-serif text-black leading-tight"
                    />

                    <p className="mt-6 text-base md:text-lg text-[#3a3a3a] leading-relaxed">
                        We're democratising carbon accounting for the digital age. Every company, from bootstrapped startups to enterprise giants, deserves access to accurate, real-time emission data without breaking the bank or hiring a team of consultants.
                    </p>

                    <span>
                        <button className="mt-8 inline-block rounded-full bg-[#1f1f1f] px-6 py-3 text-sm text-white hover:opacity-90 transition mx-1">
                            Track
                        </button>
                        <button className="mt-8 inline-block rounded-full bg-[#1f1f1f] px-6 py-3 text-sm text-white hover:opacity-90 transition mx-1">
                            Decarbon
                        </button>
                        <button className="mt-8 inline-block rounded-full bg-[#1f1f1f] px-6 py-3 text-sm text-white hover:opacity-90 transition mx-1">
                            Report
                        </button>
                    </span>

                    <p className="mt-6 text-base md:text-lg text-[#3a3a3a] leading-relaxed">
                        Transforms complex carbon calculations into source-level, actionable insights. You get a clear picture of your digital carbon footprint, industry benchmarks to see how you stack up, and concrete recommendations to reduce emissions while maintaining performance.
                    </p>


                    <div className="mt-12 space-y-3  text-black">
                        <li> This isn't just reporting, it's your sure roadmap to becoming a net-zero company. </li>

                    </div>
                </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative h-[60vh] md:h-full">
                 <video
        src="/adopters.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover rounded-2xl"
      />
            </div>
        </section>

          
           </>
    );
}
