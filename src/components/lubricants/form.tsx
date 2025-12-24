import Head from "next/head";
import Script from "next/script";

export default function LubricantFormSection() {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <title>Start Your Lubricants CO₂e Calculation</title>
            </Head>

            <Script
                 src="https://tally.so/widgets/embed.js"
                strategy="afterInteractive"
            />

            <div className="w-full h-[600px] rounded-lg overflow-hidden ">
                <iframe 
                    data-tally-src="https://tally.so/r/RGdWYj?transparentBackground=1"
                    width="100%" 
                    height="100%" 
                    marginHeight={0} 
                    marginWidth={0} 
                    title="Start Your Lubricants CO₂e Calculation" 
                    style={{ border: 0 }} 
                />
            </div>
        </>
    );
}



