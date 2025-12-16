import Head from "next/head";
import Script from "next/script";

export default function FormSection() {
  return (
    <>
      <Head>
        <title>CarbonCut - Website/Application Onboarding</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>

      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />

      <div className="w-full h-screen overflow-hidden">
        <iframe
          data-tally-src="https://tally.so/r/MeX9y0?transparentBackground=1&formEventsForwarding=1"
          title="CarbonCut - Website/Application Onboarding"
          className="w-full h-full border-0"
        />
      </div>
    </>
  );
}
