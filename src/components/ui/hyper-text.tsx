"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, MotionProps, useInView, UseInViewOptions } from "motion/react"
import { cn } from "@/lib/utils"

type CharacterSet = string[] | readonly string[]
type MarginType = UseInViewOptions["margin"]

interface HyperTextProps extends MotionProps {
  /** The text content to be animated */
  children: string
  /** Optional className for styling */
  className?: string
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Delay before animation starts in milliseconds */
  delay?: number
  /** Component to render as - defaults to div */
  as?: React.ElementType
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet
  /** Whether to use intersection observer for inView detection */
  inView?: boolean
  /** Margin for intersection observer */
  inViewMargin?: MarginType
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
) as readonly string[]

const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  inView = false,
  inViewMargin = "-50px",
  ...props
}: HyperTextProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  })

  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split("")
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const iterationCount = useRef(0)
  const elementRef = useRef<HTMLElement>(null)
  
  // Use motion's useInView hook for inView detection
  const inViewResult = useInView(elementRef, { 
    once: true, 
    margin: inViewMargin 
  })
  const isInView = !inView || inViewResult

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0
      setIsAnimating(true)
    }
  }

  // Handle animation start based on inView, startOnView, or delay
  useEffect(() => {
    // If using inView prop, wait for element to be in view
    if (inView && !isInView) {
      return
    }

    // If already animated and using inView with once:true, don't animate again
    if (inView && hasAnimated) {
      return
    }

    // If using startOnView (legacy), use IntersectionObserver
    if (startOnView && !inView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsAnimating(true)
              setHasAnimated(true)
            }, delay)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }

    // Default behavior: start after delay
    if (!startOnView && !inView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true)
        setHasAnimated(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }

    // If inView is true and element is in view, start animation
    if (inView && isInView && !hasAnimated) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true)
        setHasAnimated(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }
  }, [delay, startOnView, inView, isInView, hasAnimated])

  // Handle scramble animation
  useEffect(() => {
    if (!isAnimating) return

    const maxIterations = children.length
    const startTime = performance.now()
    let animationFrameId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      iterationCount.current = progress * maxIterations

      setDisplayText((currentText) =>
        currentText.map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount.current
              ? children[index]
              : characterSet[getRandomInt(characterSet.length)]
        )
      )

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [children, duration, isAnimating, characterSet])

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("overflow-hidden py-2 text-4xl ", className)}
      onMouseEnter={handleAnimationTrigger}
      {...props}
    >
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span
            key={index}
            className={cn("font-mono", letter === " " ? "w-3" : "")}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  )
}