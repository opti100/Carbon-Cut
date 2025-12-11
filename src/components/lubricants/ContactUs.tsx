"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { CountryDropdown } from "../NewLanding/ui/country-dropdown";

export default function LubricantCO2Form() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    volume: "",
    category: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.volume.trim()) newErrors.volume = "Production volume is required";
    if (!formData.category) newErrors.category = "Please select a category";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);

    setFormData({
      name: "",
      company: "",
      email: "",
      country: "",
      volume: "",
      category: "",
      message: "",
    });
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass =
      "w-full h-12 rounded-lg border px-4 text-gray-900 transition-all duration-200 bg-[#fcfdf6]";
    const errorClass = "border-red-500 focus:ring-2 focus:ring-red-500";
    const normalClass = "border-gray-300 focus:ring-2 focus:ring-[#6c5f31] hover:border-[#6c5f31]";
    return `${baseClass} ${errors[fieldName] ? errorClass : normalClass}`;
  };

  return (
    <>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <section className="py-20 bg-[#fcfdf6]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ------------------------- LEFT CONTENT ------------------------- */}
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold leading-tight text-black">
              Start Your Lubricants CO₂e Calculation
            </h1>

            <p className="text-xl text-gray-700">
              Get a free customised CO₂e breakdown for your top 5 lubricant SKUs.
            </p>

            <ul className="space-y-4">
              {["Accuracy", "Automation", "Real-time visibility"].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="text-[#6c5f31] mt-1" size={20} />
                  <p className="text-gray-700 text-lg">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------- RIGHT FORM ------------------------- */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#fcfdf6] shadow-xl p-10 rounded-2xl border border-gray-200 space-y-6"
          >
            {/* NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={getInputClassName("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* COMPANY */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                className={getInputClassName("company")}
              />
              {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
            </div>

            {/* EMAIL + COUNTRY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  className={getInputClassName("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* COUNTRY */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>

                <div
                  className={`rounded-lg border w-full h-12 transition-all duration-200 bg-[#fcfdf6] ${
                    errors.country
                      ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500"
                      : "border-gray-300 focus-within:ring-2 focus-within:ring-[#6c5f31] hover:border-[#6c5f31]"
                  }`}
                >
                  <CountryDropdown
                    placeholder="Select country"
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: String(value) }))
                    }
                    className="w-full h-full bg-transparent text-gray-900 px-3 flex items-center justify-between"
                  />
                </div>

                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            {/* PRODUCTION VOLUME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Annual Production Volume <span className="text-red-500">*</span>
              </label>
              <input
                id="volume"
                value={formData.volume}
                onChange={handleChange}
                placeholder="e.g. 10,000 Litres"
                className={getInputClassName("volume")}
              />
              {errors.volume && (
                <p className="text-red-500 text-sm">{errors.volume}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Lubricant Category <span className="text-red-500">*</span>
              </label>

              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className={`${getInputClassName("category")} cursor-pointer`}
              >
                <option value="" disabled>Select category</option>
                <option value="engine-oil">Engine Oil</option>
                <option value="hydraulic-oil">Hydraulic Oil</option>
                <option value="gear-oil">Gear Oil</option>
                <option value="grease">Grease</option>
                <option value="industrial-lubes">Industrial Lubricants</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Message / Requirements <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share additional requirements..."
                className="w-full min-h-[130px] rounded-lg border border-gray-300 px-4 py-3 resize-none text-gray-900 transition-all duration-200 focus:ring-2 focus:ring-[#6c5f31] hover:border-[#6c5f31] bg-[#fcfdf6]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#6c5f31] text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-200 hover:bg-[#5a4e2a] transform hover:scale-[1.02]"
            >
              Get My CO₂e Report →
            </button>

            {/* SUCCESS MESSAGE */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-700 font-medium">
                    ✅ Thanks! Your response has been submitted successfully.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>
    </>
  );
}
