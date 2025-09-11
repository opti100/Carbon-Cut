import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import Providers from "@/components/providers/providers";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

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
        className={`${montserrat.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}