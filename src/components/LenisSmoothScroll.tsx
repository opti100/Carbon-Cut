'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

interface LenisSmoothScrollProps {
  children: React.ReactNode
}

const LenisSmoothScroll: React.FC<LenisSmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  )
}

export default LenisSmoothScroll
