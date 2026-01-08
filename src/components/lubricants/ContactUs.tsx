'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import LubricantFormSection from './form'
import UniversalHeading from '../UniversalHeading'

export default function LubricantCO2Form() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    country: '',
    volume: '',
    category: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.volume.trim()) newErrors.volume = 'Production volume is required'
    if (!formData.category) newErrors.category = 'Please select a category'

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    return newErrors
  }

  return (
    <>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
      <section className="py-20 bg-[#fcfdf6]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ------------------------- LEFT CONTENT ------------------------- */}
          <div className="space-y-8 text-[#6c5f31] font-mono">
            <UniversalHeading
              title="Start Your Lubricants CO₂e Calculation"
              align="left"
            />

            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed">
              Get a free customised CO₂e breakdown for your top 5 lubricant SKUs.
            </p>

            <ul className="space-y-4">
              {['Accuracy', 'Automation', 'Real-time visibility'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="text-[#6c5f31] mt-1" size={20} />
                  <p className="text-gray-700 text-lg">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------- RIGHT FORM ------------------------- */}
          <div className="flex justify-center items-center min-h-[600px]">
            <LubricantFormSection />
          </div>
        </div>
      </section>
    </>
  )
}
