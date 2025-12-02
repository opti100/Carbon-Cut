import React from "react"

import { cn } from "@/lib/utils"

export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
  semiCircle?: boolean
  static?: boolean
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  semiCircle = false,
  static: isStatic = false,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed
  const [containerWidth, setContainerWidth] = React.useState(0)
  
  React.useEffect(() => {
    setContainerWidth(window.innerWidth)
    const handleResize = () => setContainerWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const centerX = containerWidth / 2
  const leftX = centerX - radius
  const rightX = centerX + radius
  
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          {semiCircle ? (
            <path
              className="stroke-purple-300/40 dark:stroke-purple-400/40"
              d={`M ${leftX} 100% A ${radius} ${radius} 0 0 0 ${rightX} 100%`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeWidth="2"
            />
          ) : (
            <circle
              className="stroke-black/10 stroke-1 dark:stroke-white/10"
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
            />
          )}
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const totalAngle = semiCircle ? 180 : 360
        const startAngle = semiCircle ? 0 : 0
        const angle = startAngle + (totalAngle / React.Children.count(children)) * index
        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
                ...(semiCircle ? { left: "50%", bottom: "0" } : {}),
              } as React.CSSProperties
            }
            className={cn(
              semiCircle 
                ? `${isStatic ? '' : 'animate-orbit-semi'} absolute flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full`
                : `${isStatic ? '' : 'animate-orbit'} absolute flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full`,
              { "[animation-direction:reverse]": reverse && !isStatic },
              className
            )}
            {...props}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}
