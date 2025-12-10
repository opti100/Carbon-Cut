"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ContactUs() {
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        country: "",
        volume: "",
        category: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        setSubmitted(true);

        setFormData({
            name: "",
            company: "",
            email: "",
            country: "",
            volume: "",
            category: "",
            message: "",
        });

        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div>
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Start Your Lubricants<br />CO₂e Calculation
                </h2>
                <p className="text-xl text-[#080c04]/70">
                    Get a free customised CO₂e breakdown for your top 5 lubricant SKUs.
                </p>

                <form className="my-8" onSubmit={handleSubmit}>

                    {/* Name */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Company */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            placeholder="Company name"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Email */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="abc@gmail.com"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Country */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            placeholder="Your country"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Production Volume */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="volume">Annual Production Volume</Label>
                        <Input
                            id="volume"
                            placeholder="e.g., 10,000 Litres"
                            type="text"
                            value={formData.volume}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Lubricant Category Dropdown */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="category">Lubricant Category</Label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-[45px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 
                            dark:border-gray-700 dark:bg-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-tertiary"
                        >
                            <option value="" disabled>Select category</option>
                            <option value="engine-oil">Engine Oil</option>
                            <option value="hydraulic-oil">Hydraulic Oil</option>
                            <option value="gear-oil">Gear Oil</option>
                            <option value="grease">Grease</option>
                            <option value="industrial-lubes">Industrial Lubricants</option>
                        </select>
                    </LabelInputContainer>

                    {/* Message */}
                    <LabelInputContainer className="mb-6">
                        <Label htmlFor="message">Message / Requirements</Label>
                        <textarea
                            id="message"
                            placeholder="Share additional requirements..."
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full h-[150px] resize-none rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 
                            dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-tertiary"
                        />
                    </LabelInputContainer>

                    {/* Submit */}
                    <button
                        className="group/btn relative block h-10 w-full rounded-md bg-tertiary font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                        type="submit"
                    >
                        Get My CO₂e Report →
                        <BottomGradient />
                    </button>

                    <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                </form>
            </div>

            {/* Success message */}
            <div className="flex flex-row justify-center items-start">
                <AnimatePresence>
                    {submitted && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.6 }}
                            className="text-xl pt-4 text-neutral-800 dark:text-neutral-200"
                        >
                            Thanks, your response was submitted...
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* Reusable Components */
const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full 
                bg-gradient-to-r from-transparent via-cyan-500 to-transparent 
                opacity-0 transition duration-500 group-hover/btn:opacity-100"
            />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px 
                w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent 
                opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
            />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
