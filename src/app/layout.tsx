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
        <style type="text/css" dangerouslySetInnerHTML={{__html: `
      html { margin: 0; height: 100%; overflow: hidden; }
      iframe { position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: 0; }
    `}} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <title>CarbonCut - Website/Application Onboarding</title>
      <link rel="preload" href="/LandingPage.mp4" as="video" type="video/mp4" />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
         <iframe data-tally-src="https://tally.so/r/MeX9y0?transparentBackground=1" width="100%" height="100%" frameBorder="0" marginHeight={0} marginWidth={0} title="CarbonCut - Website/Application Onboarding"></iframe>
    <title>CarbonCut - Website/Application Onboarding</title>
      <script async src="https://tally.so/widgets/embed.js"></script>

    <script async src="https://tally.so/widgets/embed.js"></script>
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
        <Script async src="https://tally.so/widgets/embed.js"></Script>

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


<html>
  <head>
  
  
  
  </head>
  <body>
   
  </body>
</html>