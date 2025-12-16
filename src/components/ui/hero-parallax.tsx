"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export const HeroParallax = ({
  products,
}: {
  products: { title: string; link: string; thumbnail: string }[];
}) => {
  const firstRow = products.slice(0, 5); // Only show first row
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[200vh] py-40 overflow-hidden antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d]"
    >
      {/* Images on top */}
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }} className="relative z-10">
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
      </motion.div>

      {/* Header behind */}
      <div className="absolute top-0 left-0 w-full z-0">
        <Header />
      </div>
    </div>
  );
};

export const Header = () => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full">
    <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
      GUILT-FREE BROWSING<br />ON YOUR PLATFORM
    </h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
      CarbonCut enables websites and apps to measure, reduce, and offset emissions as users browse — not months later.
    </p>
      {/* // Data attributes
  data-tally-open="MeX9y0" data-tally-emoji-text="👋" data-tally-emoji-animation="wave" */}


<button data-tally-open="MeX9y0" data-tally-emoji-text="👋" data-tally-emoji-animation="wave">Click me</button>

  </div>
);

export const ProductCard = ({
  product,
}: {
  product: { title: string; link: string; thumbnail: string };
}) => (
  <motion.div whileHover={{ y: -20 }} className="group/product h-96 w-[30rem] relative shrink-0">
    <a href={product.link} className="block group-hover/product:shadow-2xl">
      <img
        src={product.thumbnail}
        height="600"
        width="600"
        className="object-cover object-left-top absolute h-full w-full inset-0"
        alt={product.title}
      />
    </a>
    <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none" />
    <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
      {product.title}
    </h2>
  </motion.div>
);
