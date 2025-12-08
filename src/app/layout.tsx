import type { Metadata } from "next";
import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/providers/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon Cut",
  description: "Measure and Offset Your Marketing Carbon Emissions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="preload" href="/LandingPage.mp4" as="video" type="video/mp4" />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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

        {/* <Script 
          src="/carboncut.min.js"
          data-token="cc_mXGFQlyhMJUmhT8kozdJ8GRClOeLAZLUeS1YsLmE9VT41hVPw0KTF54IdFrnWamO"
          data-api-url="http://127.0.0.1:8000/api/v1/events/"
          data-debug="true" 
          data-domain="http://localhost:3000"
          /> */}

        <Script id="plausible-analytics" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init();
          `}
        </Script>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}