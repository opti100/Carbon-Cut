"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Globe } from '../ui/globe'
import { IconArrowMoveRight } from '@tabler/icons-react'
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

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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

      <div className="relative z-10 min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"

            >
              <motion.h2
                className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                // @ts-expect-error - ignore
                variants={itemVariants}
              >
                Trusted by<br />
               
                <span className="text-tertiary"> leading brands</span>
              </motion.h2>

              <motion.p
                className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg"
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
                <div className="flex flex-col space-y-3">
                  {/* Point 1 */}
                  <div className="flex items-start gap-2">
                    <MoveUpRight className="text-tertiary w-6 h-6 flex-shrink-0" />
                    <p className="text-base texwhite">
                      Clients report <span className="font-bold">up to 30% faster disclosure preparation</span> with audit-ready outputs.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-2">
                    <MoveUpRight className="text-tertiary w-6 h-6 flex-shrink-0" />
                    <p className="text-base text-white">
                      Users report <span className="font-bold">up to 15% lower emissions per campaign</span> without sacrificing performance.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-2">
                    <MoveUpRight className="text-tertiary w-6 h-6 flex-shrink-0" />
                    <p className="text-base text-white">
                      Every tonne neutralised tied to a verifiable on-chain retirement.
                    </p>
                  </div>
                </div>


              </motion.div>
            </motion.div>

            <motion.div
              className="relative flex items-center justify-center h-[500px] sm:h-[600px] lg:h-[650px] xl:h-[700px] order-1 lg:order-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative w-full h-full max-w-[600px] max-h-[600px]">
                <Globe className="relative w-full h-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  )
}

export default BrandsSection