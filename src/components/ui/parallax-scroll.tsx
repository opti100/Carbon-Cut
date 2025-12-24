"use client";
import { useScroll, useTransform, motion } from "motion/react";
import { cn } from "@/lib/utils";

type ParallaxItem = {
  src?: string;
  overlay?: React.ReactNode;
};

export const ParallaxScroll = ({
  items,
  className,
}: {
  items: ParallaxItem[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(items.length / 3);
  const firstPart = items.slice(0, third);
  const secondPart = items.slice(third, 2 * third);
  const thirdPart = items.slice(2 * third);

  const renderColumn = (
    column: ParallaxItem[],
    translate: any,
    keyPrefix: string
  ) =>
    column.map((item, idx) => (
      <motion.div
        key={`${keyPrefix}-${idx}`}
        style={{ y: translate }}
        className="relative"
      >
        <img
          src={item.src}
          className="h-80 w-full object-cover rounded-lg"
          alt="thumbnail"
        />

        {item.overlay && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {item.overlay}
          </div>
        )}
      </motion.div>
    ));

  return (
    <section
      className={cn(
        "relative w-full py-48", // gives scroll space
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-10 px-10">
        <div className="grid gap-10">
          {renderColumn(firstPart, translateFirst, "col-1")}
        </div>
        <div className="grid gap-10">
          {renderColumn(secondPart, translateSecond, "col-2")}
        </div>
        <div className="grid gap-10">
          {renderColumn(thirdPart, translateThird, "col-3")}
        </div>
      </div>
    </section>
  );
};
