"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  revealDelayMs?: number;
  charset?: string;
  flipDelayMs?: number;
  encryptedClassName?: string;
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function randomChar(charset: string) {
  return charset[Math.floor(Math.random() * charset.length)];
}

function initialGibberish(text: string, charset: string) {
  return text
    .split("")
    .map((c) => (c === " " ? " " : randomChar(charset)))
    .join("");
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 40,
  flipDelayMs = 30,
  charset = DEFAULT_CHARSET,
  encryptedClassName,
  revealedClassName,
}) => {
  const [revealCount, setRevealCount] = useState(0);
  const [active, setActive] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const lastFlipRef = useRef(0);
  const scrambleRef = useRef<string[]>(
    initialGibberish(text, charset).split("")
  );

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRevealCount(0);
    scrambleRef.current = initialGibberish(text, charset).split("");
  };

  useEffect(() => {
    if (!active) return;

    startTimeRef.current = performance.now();
    lastFlipRef.current = startTimeRef.current;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const total = text.length;
      const nextReveal = Math.min(
        total,
        Math.floor(elapsed / Math.max(1, revealDelayMs))
      );

      setRevealCount(nextReveal);

      // scramble unrevealed chars
      if (now - lastFlipRef.current >= flipDelayMs) {
        for (let i = nextReveal; i < total; i++) {
          scrambleRef.current[i] =
            text[i] === " " ? " " : randomChar(charset);
        }
        lastFlipRef.current = now;
      }

      if (nextReveal < total) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, text, revealDelayMs, flipDelayMs, charset]);

  if (!text) return null;

  return (
    <motion.span
      className={cn("inline-flex", className)}
      aria-label={text}
      role="text"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        reset();
      }}
    >
      {text.split("").map((char, i) => {
        const revealed = i < revealCount;
        return (
          <span
            key={i}
            className={cn(
              revealed ? revealedClassName : encryptedClassName
            )}
          >
            {revealed
              ? char
              : char === " "
              ? " "
              : scrambleRef.current[i]}
          </span>
        );
      })}
    </motion.span>
  );
};
