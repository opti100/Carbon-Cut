"use client";
import React from "react";

import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../ui/tracing-beam";
import { BlurFade } from "../ui/blur-fade";

export function BusinessImpact() {
  return (
    <>

      <div className="mt-20 font-mono max-w-7xl mx-auto">
            <BlurFade delay={0.1} inView className="mb-6 text-right ">
            
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
              Business Impact
              </h2>
            </BlurFade>
          </div>
   
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10 text-[#6c5f31]">
           

            <p className="text-4xl mb-4 font-bold">
              {item.title}
            </p>

            <div className="  prose prose-sm dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>

     </>
  );
}

const dummyContent = [
  {
    title: "Reduce carbon taxes by up to 17%",
    description: (
      <>
        <p>
          Gain a comprehensive understanding of your organization’s carbon footprint by identifying key emission hotspots across all operations. Our solution ensures you avoid overpayment penalties, while strategically maximizing available tax incentives. By automating complex calculations and integrating with your financial systems, you can streamline compliance and save valuable resources—all while contributing meaningfully to sustainability goals.
        </p>
      </>
    ),
    badge: "React",
    image:
      "/BusinessImpact/carbon1.jpg",
  },
  {
    title: "Low cost, low effort activity",
    description: (
      <>
        <p>
          Onboard your organization quickly and efficiently without disrupting day-to-day operations. Our platform is designed for seamless integration, minimizing IT overhead while enabling employees to adapt with minimal training. Whether you’re a small business or scaling rapidly, our solution grows with you, ensuring that sustainability initiatives are both cost-effective and easy to maintain over time.
        </p>
      </>
    ),
    badge: "Changelog",
    image:
      "/BusinessImpact/carbon2.jpg",
  },
  {
    title: "Double your accuracy and quality of CO2e reporting",
    description: (
      <>
        <p>
          Leverage primary activity-based data combined with real-time emission calculations to achieve the highest reporting accuracy. Our platform generates standardized, audit-ready reports that satisfy regulatory and investor requirements. By reducing manual errors and providing detailed insights, you can confidently communicate your organization’s carbon impact while enhancing credibility and transparency with stakeholders.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/auth-hero.jpg",
  },
  {
    title: "Win ESG-driven tenders",
    description: (
      <>
        <p>
          Strengthen your competitive edge by demonstrating adherence to ESG compliance standards. Our platform helps you align sustainability strategies with investor expectations, enhance your credibility in bids, and showcase measurable environmental initiatives. By clearly articulating your ESG performance, you improve your chances of winning tenders and differentiating your organization in increasingly sustainability-conscious markets.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/article-2/article4.jpg",
  },
  {
    title: "Increase stakeholder confidence",
    description: (
      <>
        <p>
          Build trust and credibility with investors, partners, and internal stakeholders through transparent sustainability reporting. Our platform ensures that all environmental data is accurate, up-to-date, and easily understandable. By consistently demonstrating leadership in climate action, your organization can strengthen relationships, enhance its reputation, and attract new investment opportunities aligned with sustainable practices.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/article-2/article6.jpg",
  },
  {
    title: "Improve supply chain transparency",
    description: (
      <>
        <p>
          Gain deep visibility into your supply chain by tracking emissions at every stage of the process. Identify high-impact vendors and collaborate with them to reduce environmental footprints. By integrating supplier emissions data into your sustainability reporting, you not only improve operational transparency but also empower your suppliers to adopt greener practices, fostering a collaborative approach to achieving Net-Zero goals.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/article-2/article2.jpg",
  },
  {
    title: "Eliminate manual carbon reporting",
    description: (
      <>
        <p>
          Say goodbye to tedious spreadsheet-based carbon reporting. Automate carbon calculations, streamline data collection, and generate detailed reports instantly. Our platform reduces administrative workload, ensures data accuracy, and accelerates reporting timelines. This allows sustainability teams to focus on strategic initiatives rather than manual data entry, improving overall efficiency while maintaining compliance with regulatory requirements.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/article-2/article3.jpg",
  },
  {
    title: "Track progress toward Net-Zero 2030/2050",
    description: (
      <>
        <p>
          Monitor reduction milestones in real-time and align your organization with globally recognized science-based targets. Our platform provides actionable insights that allow you to measure long-term progress, evaluate effectiveness of initiatives, and make informed decisions to stay on track for Net-Zero 2030/2050. Demonstrating measurable progress enhances transparency, accountability, and commitment to climate leadership.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "/article-2/article6.jpg",
  },
];
