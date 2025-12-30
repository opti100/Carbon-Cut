"use client";
import RotatingText from "../RotatingText";
import { ContainerTextFlip } from "../ui/container-text-flip";
import ActionWordCarousel from "./AnimatedHero";

const AnimatedHeroText = () => {
  return (
    <div className="flex flex-col gap-4 items-start text-left">
      {/* FIRST LINE */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
        <span className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black">
          <RotatingText
            texts={["Track", "Decarbon", "Report"]}
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
          <span className="inline-block ml-2">
            CO<sub>2</sub>e Emission
          </span>
        </span>
      </div>
    </div>
  );
};

export default AnimatedHeroText;