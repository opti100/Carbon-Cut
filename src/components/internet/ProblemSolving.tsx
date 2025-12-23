import AnimatedHeading from "./InternetHeading";

export default function ProblemWeareSolving() {
  return (
    <>
    <section className="w-full bg-[#fcfdf6] my-8 px-3 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

        {/* LEFT IMAGE */}
        <div className="relative rounded-2xl overflow-hidden">
          <video
        src="/LandingPage.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover rounded-2xl"
      />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex items-center bg-[#d1cebb] rounded-2xl px-6 md:px-16 py-12">
          <div className="max-w-xl">

            <AnimatedHeading
              text="The Problem We're Solving"
              className="text-4xl md:text-5xl font-serif font-semibold text-black leading-tight"
            />

            <p className="mt-6 text-base md:text-lg text-black leading-relaxed">
              Traditional carbon accounting wasn’t built for digital businesses.
              <br />
              If you're running an e-commerce platform, a SaaS product, or a streaming service,
              the old rules don’t apply. Standard calculators focus on manufacturing, shipping,
              and offices — completely missing the elephant in the room: your digital infrastructure.
            </p>

            <p className="mt-6 text-base md:text-lg font-medium text-black">
              Here's what companies struggle with today:
            </p>

            {/* PROBLEM LIST */}
            <ul className="mt-4 space-y-4 text-black">
              <li>
                <span className="font-semibold">Blind Spots:</span>{" "}
                No visibility into internet emissions from websites, apps, and cloud services
              </li>

              <li>
                <span className="font-semibold">Expensive Tools:</span>{" "}
                Enterprise carbon platforms cost $50K–$200K annually
              </li>

              <li>
                <span className="font-semibold">Complex Setup:</span>{" "}
                Months of implementation with specialised consultants
              </li>

              <li>
                <span className="font-semibold">Outdated Data:</span>{" "}
                Annual or quarterly reports that are obsolete by the time you see them
              </li>

              <li>
                <span className="font-semibold">Fragmented Picture:</span>{" "}
                Separate tools for ads, websites, and cloud with no unified view
              </li>

              <li>
                <span className="font-semibold">Regulatory Pressure:</span>{" "}
                New climate disclosure laws with no clear way to comply
              </li>
            </ul>

            {/* FINAL STATEMENT */}
            <p className="mt-10 text-black text-base md:text-lg leading-relaxed">
              You’re trying to hit net-zero targets with incomplete data and tools
              that weren’t designed for how modern digital businesses actually operate.
            </p>

          </div>
        </div>

      </div>
      
    </section>
       <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
       </>
  );
}
