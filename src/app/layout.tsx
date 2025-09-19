import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Montserrat } from 'next/font/google'
import Providers from "@/providers/providers";

// const montserrat = Montserrat({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// })


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
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-satoshi`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}