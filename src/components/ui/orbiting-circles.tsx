// orbiting-circles.tsx
import React from 'react';

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  activeIndex?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 4,
  activeIndex = 0,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const childArray = React.Children.toArray(children);
  
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-gray-300 stroke-2 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {childArray.map((child, index) => {
        const angle = (360 / childArray.length) * index;
        const isActive = index === activeIndex;
        
        return (
          <div
            key={index}
            style={{
              '--duration': `${calculatedDuration}s`,
              '--radius': `${radius}px`,
              '--angle': `${angle}deg`,
              '--icon-size': `${iconSize}px`,
              animation: `orbit var(--duration) linear infinite`,
              animationDirection: reverse ? 'reverse' : 'normal',
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            } as React.CSSProperties}
            className={cn(
              `absolute flex transform-gpu items-center justify-center rounded-full transition-all duration-500`,
              isActive ? 'scale-125 z-10' : 'scale-100',
              className
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
          }
          to {
            transform: rotate(360deg) translateX(var(--radius)) rotate(calc(-360deg - var(--angle)));
          }
        }
      `}</style>
    </>
  );
}