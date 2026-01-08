'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function SignupFormDemo() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    // show success message
    setSubmitted(true)

    // clear form fields
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      message: '',
    })

    // hide success message after 3s
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div>
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          CarbonCut
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="mb-4 flex space-y-2 md:flex-row md:space-y-0 md:space-x-2 justify-start items-start">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="First name"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Last name"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
              />
            </LabelInputContainer>
          </div>

          {/* Email field */}
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

          <LabelInputContainer className="mb-6">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              className="w-full h-[150px] resize-none rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary
             dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-tertiary"
            />
          </LabelInputContainer>

          {/* Submit button */}
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-tertiary font-medium text-white 
                       shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
                       dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 
                       dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Contact CarbonCut →
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>
      </div>

      {/* Success message animation */}
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
  )
}

/* ✅ Reusable components */

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full 
        bg-gradient-to-r from-transparent via-cyan-500 to-transparent 
        opacity-0 transition duration-500 group-hover/btn:opacity-100"
      />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px 
        w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent 
        opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
      />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>
}
