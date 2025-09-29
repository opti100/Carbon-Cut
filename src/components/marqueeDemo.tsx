"use client"

import Brex from "../../public/companies/Brex"
import Univison from "../../public/companies/univison"
import { Marquee } from "./ui/marquee"
import { useState, ReactNode } from "react"

export function MarqueeDemo() {
  return (
    <div className="relative flex   flex-col items-center justify-center overflow-hidden bg-white rounded-2xl">
      <Marquee pauseOnHover className="[--duration:25s] ">
        <LogoItem logo="/companies/Adobe_Corporate_logo.svg" />
        <LogoItem logo="/companies/checkr.svg" />
        <LogoItem logo="/companies/square.svg" />
        <LogoItem logo="/companies/twillo.svg" />
        <LogoItem logo="/companies/1password.png" />
        {/* <LogoItem logo="/companies/nba-6.svg" /> */}
        <LogoItem logo="/companies/sendoso.svg" />
        <LogoItem logo="/companies/Motive.webp" />
        {/* <LogoItem logo={<Univison />} /> */}
        {/* <LogoItem logo={<Brex />} /> */}
      </Marquee>
    </div>
  )
}

const LogoItem = ({ logo }: { logo: string | ReactNode }) => {
  const [imgError, setImgError] = useState(false)

  // If logo is a string (image path)
  if (typeof logo === "string") {
    return (
      <div className="flex items-center justify-center w-28 h-28 mx-6">
        {!imgError ? (
          <img
            src={logo}
            alt="logo"
            className="max-h-16 max-w-24 object-contain filter grayscale brightness-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
            Logo
          </span>
        )}
      </div>
    )
  }

  // If logo is a React component (SVG)
return (
  <div className="flex items-center justify-center w-28 h-28 text-black">
    {typeof logo === "object" ? (
      <div className="w-full h-full text-black">{logo}</div>
    ) : (
      logo
    )}
  </div>
)

}
