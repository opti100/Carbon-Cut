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
  title: 'Carbon Cut',
  description: 'Measure and Offset Your Marketing Carbon Emissions',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="preload" href="/LandingPage.mp4" as="video" type="video/mp4" />
      <body className={`${inter.variable} font-sans`}>
        <Toaster richColors />
        
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y388SH4Y4G"
          strategy="afterInteractive"
        />
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