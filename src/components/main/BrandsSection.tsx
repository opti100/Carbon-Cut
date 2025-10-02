"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Globe } from '../ui/globe'
import { MoveUpRight } from 'lucide-react'

const BrandsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1]
      }
    }
  }

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #00CC33 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #00CC33 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, #00CC33 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content Section */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-center lg:text-left"
                // @ts-expect-error - ignore
                variants={itemVariants}
              >
                Trusted by<br />
                <span className="text-tertiary">leading brands</span>
              </motion.h2>

              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg text-center lg:text-left mx-auto lg:mx-0"
                // @ts-expect-error - ignore
                variants={itemVariants}
              >
                CarbonCut delivers defensible CO₂e data that stands up to SECR, SEC, and CSRD disclosure.
              </motion.p>

              <motion.div
                className="space-y-4"
                // @ts-expect-error - ignore
                variants={itemVariants}
              >
                <div className="flex flex-col gap-4">
                  {/* Point 1 */}
                  <div className="flex items-start gap-3">
                    <MoveUpRight className="text-tertiary w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-base text-white leading-relaxed">
                      Clients report <span className="font-bold">up to 30% faster disclosure preparation</span> with audit-ready outputs.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-3">
                    <MoveUpRight className="text-tertiary w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-base text-white leading-relaxed">
                      Users report <span className="font-bold">up to 15% lower emissions per campaign</span> without sacrificing performance.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-3">
                    <MoveUpRight className="text-tertiary w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-base text-white leading-relaxed">
                      Every tonne neutralised tied to a verifiable on-chain retirement.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Globe Section */}
            <motion.div
              className="relative flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[650px] xl:h-[700px] w-full order-first lg:order-last"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative w-full h-full max-w-[400px] sm:max-w-[500px] max-h-[400px] sm:max-h-[500px]">
                <Globe className="relative w-full h-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  )
}

export default BrandsSection