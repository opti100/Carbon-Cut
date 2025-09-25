"use client"

import React from 'react'
import { motion } from 'framer-motion'

const BrandsSection = () => {
  const brands = [
    { name: 'Adobe', logo: 'Adobe' },
    { name: 'Checkr', logo: 'Checkr' },
    { name: 'Square', logo: 'Square' },
    { name: 'Twilio', logo: 'twilio' },
    { name: '1Password', logo: '1Passw0rd' },
    { name: 'Broadcom', logo: 'BROADCOM' },
    { name: 'NBA', logo: 'NBA' },
    { name: 'Sendoso', logo: 'Sendoso' },
    { name: 'Motive', logo: 'motive', subtitle: 'Formerly KeepTruckin' },
    { name: 'Brex', logo: 'Brex' },
    { name: 'Univision', logo: 'univision' },
  ]

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
    <section className="relative w-full h-auto bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #00CC33 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #00CC33 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, #00CC33 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full">
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                // @ts-expect-error - ignore
                variants={itemVariants}
              >
                Leading brands<br />
                are choosing<br />
                <span className="text-tertiary">CarbonCut</span>
              </motion.h2>
              
              <motion.p 
                className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg"
                 // @ts-expect-error - ignore
                variants={itemVariants}
              >
                Companies are moving beyond outdated carbon calculators with a platform built for accuracy, transparency, and impact.
              </motion.p>
              
              <motion.div 
                className="space-y-4"
                 // @ts-expect-error - ignore
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-tertiary text-2xl font-bold">↗</div>
                  <div className="text-2xl lg:text-3xl font-bold text-tertiary">15%</div>
                  <div className="text-lg text-gray-300">average emission reduction</div>
                </div>
                <p className="text-sm text-gray-400 pl-8">
                  achieved by CarbonCut users across marketing and advertising campaigns.
                </p>
              </motion.div>
            </motion.div>

            

            <motion.div 
              className="grid grid-cols-2 gap-8 lg:gap-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  className="flex flex-col items-center justify-center p-4 lg:p-6 rounded-lg bg-gray-900/30 backdrop-blur-sm border border-gray-800 hover:border-tertiary/30 transition-all duration-300 group"
                   // @ts-expect-error - ignore
                  variants={logoVariants}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(0, 204, 51, 0.05)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xl lg:text-2xl font-bold text-gray-300 group-hover:text-white transition-colors duration-300 text-center">
                    {brand.logo}
                  </div>
                  {brand.subtitle && (
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {brand.subtitle}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div> 
            {/* <Globe data={[]} globeConfig={}/> */}
          </div>
        </div>
      </div>

    
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  )
}

export default BrandsSection