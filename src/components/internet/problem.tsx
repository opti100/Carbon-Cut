import React from "react";
import AnimatedHeading from "./InternetHeading";


const Problem = () => {
  return (
    <div className="bg-[#fcfdf6]">
      {/* Section 1 */}
      <div className="min-h-screen max-w-8xl  mt-28 mx-auto px-15 flex flex-col items-start justify-center text-left">
  <AnimatedHeading
    text="Your Internet Business Has a Carbon Footprint. We Help You Track, Reduce, and Report It.."
    className="text-5xl font-semibold"
  />

  <p className="max-w-5xl text-md text-accent-foreground  mt-6">
    Every website visit, every app session, every ad impression, every transaction they all consume energy and that energy creates emissions. If you're running a internet business, you're responsible for more than just your office's electricity bill. Your servers, your traffic, your entire digital infrastructure contributes to climate change.
  </p>
</div>


      {/* Section 2 */}
      <div className="min-h-screen max-w-8xl mx-auto flex flex-col  px-15 items-start justify-center text-left">
        <AnimatedHeading
          text="The problem?"
          className="text-5xl font-semibold text-left"
        />

       <p className="max-w-5xl text-md text-accent-foreground mt-8 ">
          Most companies have no idea how much their internet company operations actually emit. And the ones that do are paying tens of thousands for complex carbon accounting tools or hiring expensive consultants.
        </p>
      </div>

      {/* Section 3 */}
      <div className="min-h-screen max-w-8xl flex flex-col items-center justify-center px-15 mx-auto text-center">
        <AnimatedHeading
          text={`UNTIL  NOW`}
          className="text-6xl md:text-7xl lg:text-9xl font-bold leading-none tracking-tight"
        />
      </div>

       <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

    </div>
  );
};

export default Problem;
