'use client'
import React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { BlurFade } from '../ui/blur-fade'
import Link from 'next/link'
import { PinContainer } from '../ui/pin-3d'
import UniversalHeading from '../UniversalHeading'

export function InternetAdsWebApp() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <UniversalHeading
          title="Choose Your Emission Category"
          description="Understanding your digital footprint starts here. Select what matters most to your business."
          align="right"
        />

        <div className="py-20 flex flex-col lg:flex-row items-center justify-evenly bg-[#fcfdf6] dark:bg-black max-w-7xl  mx-auto px-8">
          <PinContainer title="Internet Ads" href="/internet/internet-ads">
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">
                  Track the carbon cost of every impression, click, and campaign across
                  your advertising ecosystem.
                </span>
              </div>
              <div className="relative flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                <Image
                  src="/internet/internet-ads.png"
                  alt="Internet Ads"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </PinContainer>

          <PinContainer title="Web & Apps" href="/internet/web-&-apps">
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">
                  Measure the emissions from your websites, applications, and digital
                  services your customers use daily.
                </span>
              </div>
              <div className="relative flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                <Image
                  src="/internet/web-apps.png"
                  alt="Web & Apps"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </PinContainer>
        </div>
      </div>

      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
    </>
  )
}
