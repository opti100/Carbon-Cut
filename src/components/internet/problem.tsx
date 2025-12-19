import React from "react";
import AnimatedHeading from "./InternetHeading";


const Problem = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="min-h-screen max-w-3xl mt-28 flex flex-col  px-4 mx-auto items-center justify-center">
        <AnimatedHeading
          text="Your Digital Business Has a Carbon Footprint. We Help You Track, Reduce, and Report It."
          className="text-3xl font-semibold"
        />

        <p className="max-w-3xl mt-10">
    Every website  visit, every app session, every ad impression they all
          consume energy. And that energy creates emissions.
        </p>
      </div>

      {/* Section 2 */}
      <div className="min-h-screen max-w-3xl flex flex-col  px-4 mx-auto  justify-center">
        <AnimatedHeading
          text="The problem?"
          className="text-3xl font-semibold"
        />

        <p className="max-w-5xl mt-10">
          Most companies have no idea how much their digital operations actually emit.
        </p>
      </div>

      {/* Section 3 */}
      <div className="min-h-screen max-w-3xl flex flex-col items-center justify-center px-4 mx-auto text-center">
        <AnimatedHeading
          text="UNTIL NOW."
          className="text-6xl font-bold"
        />
      </div>
    </div>
  );
};

export default Problem;
