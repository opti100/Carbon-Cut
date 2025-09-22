import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqData = [
  {
    question: "What is CarbonCut Marketing CO₂e Calculator?",
    answer: "The CarbonCut Marketing CO₂e Calculator is a tool that helps brands estimate the carbon emissions associated with their marketing activities. It allows you to measure emissions from various channels, including digital ads, and calculate your carbon footprint per marketing campaign.",
    category: "basics"
  },
  {
    question: "How do I use the CarbonCut Marketing CO₂e Calculator?",
    answer: "Simply select your marketing channel, enter the quantity of your activity (like impressions, clicks, or spend), choose your market location, and our calculator will automatically compute the CO₂ equivalent emissions using verified emission factors and real-time data.",
    category: "usage"
  },
  {
    question: "What equivalents does the calculator provide?",
    answer: "Our calculator provides comprehensive equivalents including kg CO₂e, tons CO₂e, and real-world comparisons like car miles driven, trees needed for offset, and household energy consumption. We also show breakdowns by channel, market, and emission scope.",
    category: "features"
  },
  {
    question: "Who should use the CarbonCut Marketing CO₂e Calculator?",
    answer: "Marketing teams, sustainability managers, brand managers, agencies, and any organization looking to measure and reduce their marketing carbon footprint. It's perfect for companies committed to ESG reporting and carbon neutrality goals.",
    category: "audience"
  },
  {
    question: "What other names or terms are used for this type of tool?",
    answer: "Common terms include: Marketing Carbon Calculator, Digital Advertising Emissions Calculator, Campaign Footprint Tracker, Marketing Sustainability Tool, AdTech Carbon Estimator, and Marketing Environmental Impact Calculator.",
    category: "terminology"
  },
  {
    question: "How can I install the CarbonCut Marketing CO₂e Calculator on my website?",
    answer: "Contact our team for API integration options and embeddable widgets. We offer flexible integration solutions including JavaScript widgets, REST APIs, and custom implementations that match your brand and technical requirements.",
    category: "integration"
  }
];

// const getCategoryInfo = (category: string) => {
//   switch (category) {
//     case "basics":
//       return { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Basics" };
//     case "usage":
//       return { color: "bg-tertiary/10 text-tertiary border-tertiary/20", label: "Usage" };
//     case "features":
//       return { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Features" };
//     case "audience":
//       return { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Audience" };
//     case "terminology":
//       return { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Terms" };
//     case "integration":
//       return { color: "bg-green-100 text-green-700 border-green-200", label: "Integration" };
//     default:
//       return { color: "bg-gray-100 text-gray-700 border-gray-200", label: "General" };
//   }
// };

export default function CalculatorFAQ() {
  return (
    <div className="bg-white px-6 py-14 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-5xl  text-gray-900">
          About <span className="text-orange-500">CarbonCut</span> Equivalent CO₂e
          <br />
          <span className="text-gray-600">Calculator</span>
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Everything you need to know about our marketing carbon calculator. 
          We use <strong className="text-orange-500">verified emission factors</strong> for accurate calculations.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => {
            // const categoryInfo = getCategoryInfo(faq.category);

            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-tertiary transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
