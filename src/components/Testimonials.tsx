'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface Testimonial {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  date: string;
  text: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoAdvanceMs?: number;
}

const radius = 150; // radius for arc layout in px

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoAdvanceMs = 5000,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, autoAdvanceMs);

    return () => clearInterval(interval);
  }, [testimonials.length, autoAdvanceMs]);

  const handleAvatarClick = (idx: number) => {
    setActiveIdx(idx);
  };

  const getArcPosition = (idx: number, total: number, activeIndex: number) => {
    const spread = Math.min(total, 5); // visible avatars
    const middle = Math.floor(spread / 2);
    const offset = idx - activeIndex;

    if (Math.abs(offset) > middle) return null;

    const angleStep = 30; 
    const angle = angleStep * offset;
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const y = -Math.cos(rad) * 20;

    const scale = offset === 0 ? 1 : 0.7;
    const opacity = offset === 0 ? 1 : 0.5;

    return { x, y, scale, opacity, zIndex: 1000 - Math.abs(offset) };
  };

  const active = testimonials[activeIdx];

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center">
      {/* Avatars */}
      <div className="relative w-full md:w-1/3 h-64 flex justify-center items-center">
        {testimonials.map((t, idx) => {
          const pos = getArcPosition(idx, testimonials.length, activeIdx);
          if (!pos) return null;
          return (
            <motion.div
              key={t.id}
              className="absolute cursor-pointer flex flex-col items-center"
              style={{ zIndex: pos.zIndex }}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => handleAvatarClick(idx)}
            >
              <div className="rounded-full overflow-hidden border-2 border-indigo-600 w-20 h-20">
                <Image src={t.avatarUrl} width={80} height={80} alt={t.name} />
              </div>
              <div className="mt-2 text-center">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">
                  ⭐ {t.rating.toFixed(1)} · {t.date}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Testimonial Text */}
      <div className="md:w-2/3 w-full mt-8 md:mt-0 md:pl-8 relative min-h-[150px]">
        <AnimatePresence >
          <motion.blockquote
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg leading-relaxed italic text-gray-800"
          >
            “{active.text}”
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
