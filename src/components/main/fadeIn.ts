import { useEffect, useRef, useState } from 'react'

export const useFadeInOnScroll = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const fadeStart = windowHeight * 0.8
      const fadeEnd = windowHeight * 0.2

      if (rect.top <= fadeStart && rect.top >= fadeEnd) {
        const progress = (fadeStart - rect.top) / (fadeStart - fadeEnd)
        setOpacity(Math.min(progress, 1))
      } else if (rect.top < fadeEnd && rect.bottom > windowHeight * 0.3) {
        setOpacity(1)
      } else if (rect.bottom <= windowHeight * 0.3) {
        const progress = rect.bottom / (windowHeight * 0.3)
        setOpacity(Math.max(progress, 0))
      } else {
        setOpacity(0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { sectionRef, opacity } // <-- important
}
