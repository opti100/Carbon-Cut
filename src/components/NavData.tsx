import { CardNavItem } from './CardNav'

export const navData: CardNavItem[] = [
  {
    label: 'Products',
    bgColor: '#b0ea1d',
    textColor: '#080c04',
    links: [
      {
        label: 'Carbon Calculator',
        href: '/signup',
        ariaLabel: 'Go to Carbon Calculator',
      },
      {
        label: 'Carbon Live',
        href: '/internet',
        ariaLabel: 'Go to Carbon Live',
      },
      // {
      //   label: 'Carbon Offset',
      //   href: '/',
      //   ariaLabel: 'Go to Carbon Offset',
      // },
    ],
  },
  {
    label: 'Solutions',
    bgColor: '#080c04',
    textColor: '#b0ea1d',
    links: [
      {
        label: 'Methodology',
        href: '/methodology',
        ariaLabel: 'View our methodology',
      },
      // {
      //   label: 'Projects',
      //   href: '/projects',
      //   ariaLabel: 'View our projects',
      // },
    ],
  },
  {
    label: 'Company',
    bgColor: '#fcfdf6',
    textColor: '#080c04',
    links: [
      {
        label: 'Blogs',
        href: '/blogs',
        ariaLabel: 'Read our blogs',
      },
      {
        label: 'About',
        href: '/about',
        ariaLabel: 'Learn about us',
      },
    ],
  },
]
