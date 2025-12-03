"use client";
import ActionWordCarousel from "./AnimatedHero";

const AnimatedHeroText = () => {
  return (
    <div className="flex flex-col gap-6 items-center text-center">

      {/* FIRST LINE */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-6">
         <span className="inline-flex leading-none bg-emerald-400/20 backdrop-blur-sm rounded-lg">

          <ActionWordCarousel />
        </span>
        <span className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white ">
          Carbon Emission
        </span>
      </div>
    </div>
  );
};

export default AnimatedHeroText;