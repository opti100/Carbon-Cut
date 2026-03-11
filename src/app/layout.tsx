import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/providers/providers'
import Script from 'next/script'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'CarbonCut — Real-Time Carbon Emissions Tracking & Offsetting Platform',
    template: '%s | CarbonCut',
  },
  description:
    'CarbonCut is the world\'s first CliMarTech platform providing real-time carbon emissions measurement, tracking, and auto-offsetting for digital businesses and marketing operations. GHG Protocol & ISO 14064 compliant.',
  keywords: [
    'carbon emissions tracking',
    'carbon footprint calculator',
    'real-time carbon monitoring',
    'marketing carbon emissions',
    'carbon offsetting platform',
    'CliMarTech',
    'ESG reporting',
    'GHG Protocol',
    'net-zero',
    'Scope 3 emissions',
    'digital carbon footprint',
    'sustainability platform',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://carboncut.co'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carboncut.co',
    siteName: 'CarbonCut',
    title: 'CarbonCut — Real-Time Carbon Emissions Tracking & Offsetting',
    description:
      'The world\'s first CliMarTech platform. Measure, track, and offset carbon emissions from digital operations and marketing in real time.',
    images: [
      {
        url: '/CarbonCut-fe/cc-croped.svg',
        width: 1200,
        height: 630,
        alt: 'CarbonCut - Real-Time Carbon Emissions Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CarbonCut_co',
    title: 'CarbonCut — Real-Time Carbon Emissions Tracking',
    description:
      'The world\'s first CliMarTech platform. Real-time carbon emissions measurement, tracking, and auto-offsetting.',
  },
  alternates: {
    canonical: 'https://carboncut.co',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CarbonCut',
    legalName: 'Carbon Tech International Limited',
    url: 'https://carboncut.co',
    logo: 'https://carboncut.co/CarbonCut-fe/cc-croped.svg',
    description:
      'CarbonCut is the world\'s first CliMarTech (Climate Marketing Technology) platform providing real-time carbon emissions measurement, tracking, and auto-offsetting for digital businesses and marketing operations.',
    foundingDate: '2025',
    sameAs: [
      'https://www.linkedin.com/company/carboncut-co/',
      'https://x.com/CarbonCut_co',
      'https://www.instagram.com/carboncut.co',
      'https://www.facebook.com/profile.php?id=61580263412275',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@carboncut.co',
      contactType: 'customer service',
    },
    knowsAbout: [
      'Carbon emissions tracking',
      'Carbon offsetting',
      'GHG Protocol',
      'ISO 14064',
      'Scope 3 emissions',
      'Marketing carbon footprint',
      'Real-time carbon monitoring',
      'CliMarTech',
      'ESG reporting',
      'Net-zero strategy',
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CarbonCut',
    url: 'https://carboncut.co',
    description:
      'Real-time carbon emissions measurement, tracking, and offsetting platform for digital businesses.',
    publisher: {
      '@type': 'Organization',
      name: 'CarbonCut',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <link rel="preload" href="/LandingPage.mp4" as="video" type="video/mp4" />
      <body className={`${inter.variable} font-sans`}>
        <Toaster richColors />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y388SH4Y4G"
          strategy="afterInteractive"
        />
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vqcachazxh");
          `}
        </Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y388SH4Y4G');
          `}
        </Script>

        <Script id="plausible-analytics" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init();
          `}
        </Script>

        <Providers>{children}</Providers>
      </body>
    </html>
  )
}