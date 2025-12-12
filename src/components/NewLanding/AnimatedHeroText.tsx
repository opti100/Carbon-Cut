"use client";
import { ContainerTextFlip } from "../ui/container-text-flip";
const AnimatedHeroText = () => {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="flex flex-col md:flex-row  items-center justify-center gap-4 md:gap-6">
        <span className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white ">
          <ContainerTextFlip
            interval={1500}
            animationDuration={300}
            textClassName=''
            className="inline-block text-tertiary"
            words={["Calculate", "Reduce", "Offset"]}
          />
          CO<sub>2</sub>e Emission
        </span>
      </div>
    </div>
  );
};

export default AnimatedHeroText;