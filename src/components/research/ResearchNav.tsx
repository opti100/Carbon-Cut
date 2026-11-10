'use client'

import CardNav from '@/components/CardNav'
import { navData } from '@/components/NavData'

/** Site navigation for light-background research pages (CardNav is a client component). */
export default function ResearchNav() {
  return (
    <CardNav
      logo="/CarbonCut-fe/CC.svg"
      logoAlt="CarbonCut Logo"
      items={navData}
      baseColor="rgba(255, 255, 255, 0.85)"
      menuColor="#080c04"
      buttonBgColor="#b0ea1d"
      buttonTextColor="#080c04"
    />
  )
}
