import React, { useRef, useState } from 'react'
import { GoArrowUpRight } from 'react-icons/go'
import './CardNav.css'
import Link from 'next/link'

type CardNavLink = {
  label: string
  href: string
  ariaLabel: string
}

export type CardNavItem = {
  label: string
  bgColor: string
  textColor: string
  links: CardNavLink[]
}

export interface CardNavProps {
  logo: string
  logoAlt?: string
  items: CardNavItem[]
  className?: string
  ease?: string
  baseColor?: string
  menuColor?: string
  buttonBgColor?: string
  buttonTextColor?: string
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  baseColor = '#fff',
  menuColor = '#000',
  buttonBgColor = '#111',
  buttonTextColor = '#fff',
}) => {
  const [showNavbar, setShowNavbar] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const lastScrollY = useRef(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      if (current < 10) {
        setShowNavbar(true)
        lastScrollY.current = current
        return
      }

      if (current > lastScrollY.current) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        className="card-nav"
        style={{
          backgroundColor: baseColor,
          transform: showNavbar ? 'translateY(0)' : 'translateY(-110%)',
          opacity: showNavbar ? 1 : 0,
          pointerEvents: showNavbar ? 'auto' : 'none',
          transition: 'transform 0.35s ease, opacity 0.25s ease',
        }}
      >
        <div className="flex items-center justify-between w-full px-6 py-2">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-6 relative">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="nav-item-wrapper"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <span
                    className="text-base transition-opacity hover:opacity-70 cursor-pointer"
                    style={{ color: menuColor }}
                  >
                    {item.label}
                  </span>

                  {/* Hover Card */}
                  <div
                    className="nav-card-dropdown"
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.textColor,
                      opacity: hoveredCard === idx ? 1 : 0,
                      visibility: hoveredCard === idx ? 'visible' : 'hidden',
                      transform: hoveredCard === idx ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
                    }}
                  >
                    <div className="nav-card-label-dropdown">{item.label}</div>
                    <div className="nav-card-links-dropdown">
                      {item.links?.map((lnk, i) => (
                        <Link
                          key={`${lnk.label}-${i}`}
                          className="nav-card-link-dropdown"
                          href={lnk.href}
                          aria-label={lnk.ariaLabel}
                        >
                          <GoArrowUpRight className="nav-card-link-icon-dropdown" aria-hidden="true" />
                          {lnk.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/login">
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Login / Signup
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default CardNav