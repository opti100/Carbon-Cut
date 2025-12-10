"use client"

export default function Problem() {

  return (
    <div className="bg-[#fcfdf6] text-[#080c04]">
      {/* Problem Section */}
      <section className="py-32  text-black">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Title */}
          <div className=" mb-20 text-[#d1cebb] text-end">
            <p className=" ">
              Your CO₂e data is outdated, averaged, and full of blind spots.
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              The Lubricants Industry’s Hidden Problem
            </h2>

            <div className="w-24 h-1 mt-2 bg-[#b0ea1d] mx-auto"></div>
          </div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-12">

            {/* LEFT BIG BOX */}
            <div className="border border-[#d1cebb] rounded-3xl p-10 space-y-6">
              <h3 className="text-3xl font-bold mb-6 text-[#b0ea1d]">
                Traditional ESG systems rely on:
              </h3>

              {[
                "Annual sustainability reporting",
                "Generic emission factors",
                "Vendor PDFs and manual spreadsheets",
                "No product-level accuracy",
                "No real-time traceability",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 text-lg">
                  {/* <div className="w-3 h-3 bg-pink-500 rounded-full mt-2" /> */}
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE 4 BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Incorrect emission disclosures",
                },
                {
                  title: "Higher carbon taxes",
                },
                {
                  title: "Poor ESG scores",
                },
                {
                  title: "Lost B2B contracts",
                },
                {
                  title: "Zero visibility on scope 1/2/3 breakdown"
                }
              ].map((box, idx) => (
                <div
                  key={idx}
                  className="border border-[#d1cebb] rounded-3xl px-8 py-4 transition"
                >
                  <h4 className="text-xl font-bold  text-[#b0ea1d]">
                    {box.title}
                  </h4>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}