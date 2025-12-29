import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqData = [
  {
    question: "How accurate is your emission tracking?",
    answer:
      "We achieve 90%+ accuracy by combining actual usage data from your systems with the latest emission factors from the International Energy Agency and Green Web Foundation. Unlike estimates, we measure real activity.",
    category: "Accuracy",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most companies are tracking emissions within 24–48 hours. Our integrations are plug-and-play for popular platforms, and custom setups rarely take more than a week.",
    category: "Implementation",
  },
  {
    question: "Do I need a sustainability expert on my team?",
    answer:
      "No. Our platform is built for product managers, developers, and operations teams. We translate complex carbon science into simple dashboards and clear actions.",
    category: "Usability",
  },
  {
    question: "Can I use this data for regulatory reporting?",
    answer:
      "Yes. Our methodology aligns with GHG Protocol standards and emerging digital emission frameworks. We provide audit-ready reports suitable for regulatory compliance and investor disclosure.",
    category: "Compliance",
  },
  {
    question: "What if I use multiple cloud providers?",
    answer:
      "That’s no problem. We integrate with AWS, Google Cloud, Azure, and other major providers simultaneously, giving you a unified view across your entire infrastructure.",
    category: "Integrations",
  },
  {
    question: "How does this help me reduce emissions, not just measure them?",
    answer:
      "We provide specific, prioritized recommendations such as optimizing images, choosing greener data centers, implementing efficient caching, and reducing unnecessary data transfer. Each suggestion includes estimated emission reduction and implementation difficulty.",
    category: "Impact",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We’re SOC 2 Type II compliant and never access your customer data or business logic. We only track metadata like request counts, data transfer volumes, and resource usage.",
    category: "Security",
  },
  {
    question: "What does it cost?",
    answer:
      "Pricing scales with your digital footprint, starting at a fraction of traditional carbon accounting tools. Most growing companies start for less than the cost of one employee.",
    category: "Pricing",
  },
];




export default function FAQInternet() {
  return (
    <>
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-20 lg:py-28" style={{ background: "#fcfdf6" }}>

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 md:space-y-24">

        {/* SECTION 1 */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">

            {/* LEFT TITLE */}
            <div className="lg:col-span-4">
              <h3
                className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase  text-left"
                style={{ color: "#080c04" }}
              >
                General FAQ
              </h3>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-2"></div>

            {/* RIGHT SIDE ACCORDION */}
            <div className="lg:col-span-6">
              <Accordion type="single" collapsible className="space-y-0">
                {faqData.slice(0, 4).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`general-${index}`}
                    className="border-b"
                    style={{ borderColor: "#d1cebb" }}
                  >
                    <AccordionTrigger
                      className="py-4 sm:py-6 px-2 sm:px-4 -mx-2 sm:-mx-4 hover:no-underline rounded-lg"
                      style={{ color: "#080c04" }}
                    >
                      <h4 className="text-base sm:text-lg lg:text-xl font-normal pr-4 text-left">
                        {faq.question}
                      </h4>
                    </AccordionTrigger>

                    <AccordionContent
                      className="pb-4 sm:pb-6 px-2 sm:px-4 text-sm sm:text-base lg:text-lg leading-relaxed"
                      style={{ color: "#6c5f31" }}
                    >
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16">

          {/* CLEAN FULL-WIDTH DIVIDER */}
          <div className="w-full border-t-2 border-dotted" style={{ borderColor: "#d1cebb" }}></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">

            {/* LEFT TITLE */}
            <div className="lg:col-span-4">
              <h3
                className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase  text-left whitespace-nowrap"
                style={{ color: "#080c04" }}
              >
                Everything You Need to Know <br /> About Internet Emissions
              </h3>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-2"></div>

            {/* RIGHT ACCORDION */}
            <div className="lg:col-span-6">
              <Accordion type="single" collapsible className="space-y-0">
                {faqData.slice(4).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`solution-${index}`}
                    className="border-b"
                    style={{ borderColor: "#d1cebb" }}
                  >
                    <AccordionTrigger
                      className="py-4 sm:py-6 px-2 sm:px-4 -mx-2 sm:-mx-4 hover:no-underline rounded-lg"
                      style={{ color: "#080c04" }}
                    >
                      <h4 className="text-base sm:text-lg lg:text-xl font-normal pr-4 text-left">
                        {faq.question}
                      </h4>
                    </AccordionTrigger>

                    <AccordionContent
                      className="pb-4 sm:pb-6 px-2 sm:px-4 text-sm sm:text-base lg:text-lg leading-relaxed"
                      style={{ color: "#6c5f31" }}
                    >
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </div>

      </div>
    </div>

      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
      </>
  );
}


