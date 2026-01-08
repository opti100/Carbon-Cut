import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const faqData = [
  {
    question: 'What are Scope 1, 2, and 3 emissions?',
    answer:
      'Scope 1 covers direct emissions from company operations, Scope 2 refers to emissions from purchased energy, and Scope 3 includes indirect emissions such as the burning of sold products.',
    category: 'Standards',
  },
  {
    question: 'How can companies reduce emissions?',
    answer:
      'Companies can reduce emissions by capturing carbon, preventing methane leaks, using cleaner energy in operations, and improving efficiency in transport. Investing in renewable energy and offsets also helps.',
    category: 'Mitigation',
  },
  {
    question: 'What are regulatory standards for oil and gas emissions?',
    answer:
      'Regulations vary but often include methane leak detection, limits on flaring, emissions reporting, and compliance with carbon pricing or trading systems. These rules encourage companies to reduce their environmental impact.',
    category: 'Regulations',
  },
  {
    question: 'What is the role of carbon tracking in this industry?',
    answer:
      'Carbon tracking helps companies identify where emissions occur, comply with regulations, improve efficiency, and demonstrate transparency to investors and stakeholders. It is essential for achieving sustainability goals.',
    category: 'Tracking',
  },
  {
    question: 'Are all oil and gas emissions unavoidable?',
    answer:
      'No. While some emissions are inherent, many can be reduced through better technology, monitoring, and cleaner energy use. Methane leaks, in particular, can be minimized significantly.',
    category: 'Reduction',
  },
  {
    question: 'How does oil and gas carbon impact climate change?',
    answer:
      'Emissions trap heat in the atmosphere, raising global temperatures, causing extreme weather, ocean acidification, and rising sea levels. Reducing emissions from this sector is critical to meeting climate targets.',
    category: 'Climate Impact',
  },
  {
    question: 'What are carbon emissions in the oil and natural gas sector?',
    answer:
      'Carbon emissions are greenhouse gases, mainly carbon dioxide and methane, released during the extraction, processing, transportation, and use of oil and natural gas. These emissions contribute to global warming and climate change.',
    category: 'Basics',
  },
  {
    question: 'Why do oil and natural gas operations produce carbon emissions?',
    answer:
      'Emissions occur throughout the supply chain. Drilling and extraction release methane, refining fuels emits CO₂, and transportation can cause leaks or combustion emissions. Even using the final products generates CO₂ when burned.',
    category: 'Operations',
  },
]

export default function FAQGas() {
  return (
    <>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
      <div
        className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-20 lg:py-28"
        style={{ background: '#fcfdf6' }}
      >
        <div className="max-w-[1400px] mx-auto space-y-12 sm:space-y-16 md:space-y-24">
          {/* SECTION 1 */}
          <div className="space-y-8 sm:space-y-12 md:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
              {/* LEFT TITLE */}
              <div className="lg:col-span-4">
                <h3
                  className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase  text-left"
                  style={{ color: '#080c04' }}
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
                      style={{ borderColor: '#d1cebb' }}
                    >
                      <AccordionTrigger
                        className="py-4 sm:py-6 px-2 sm:px-4 -mx-2 sm:-mx-4 hover:no-underline rounded-lg"
                        style={{ color: '#080c04' }}
                      >
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal pr-4 text-left">
                          {faq.question}
                        </h4>
                      </AccordionTrigger>

                      <AccordionContent
                        className="pb-4 sm:pb-6 px-2 sm:px-4 text-sm sm:text-base lg:text-lg leading-relaxed"
                        style={{ color: '#6c5f31' }}
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
            <div
              className="w-full border-t-2 border-dotted"
              style={{ borderColor: '#d1cebb' }}
            ></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
              {/* LEFT TITLE */}
              <div className="lg:col-span-4">
                <h3
                  className="text-balance text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-left leading-tight"
                  style={{ color: '#080c04' }}
                >
                  Everything You Need to Know About Oil & Natural Gas
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
                      style={{ borderColor: '#d1cebb' }}
                    >
                      <AccordionTrigger
                        className="py-4 sm:py-6 px-2 sm:px-4 -mx-2 sm:-mx-4 hover:no-underline rounded-lg"
                        style={{ color: '#080c04' }}
                      >
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal pr-4 text-left">
                          {faq.question}
                        </h4>
                      </AccordionTrigger>

                      <AccordionContent
                        className="pb-4 sm:pb-6 px-2 sm:px-4 text-sm sm:text-base lg:text-lg leading-relaxed"
                        style={{ color: '#6c5f31' }}
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
  )
}
