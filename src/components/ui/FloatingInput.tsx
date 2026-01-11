"use client";

import { useState } from "react";
import clsx from "clsx";

interface FloatingInputProps {
  placeholder?: string;
  size?: "small" | "medium" | "big";
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

export default function FloatingInput({
  placeholder,
  size = "medium",
  value: controlledValue,
  onChange,
  type = "text",
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isActive = focused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const sizeStyles = {
    small: "h-9 px-3 text-sm",
    medium: "h-11 px-3 text-md",
    big: "h-14 px-4 text-base",
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={clsx(
          "w-full rounded-md border border-[#d1cebb] bg-transparent outline-none transition-all focus:border-black",
          sizeStyles[size]
        )}
      />

      {/* Floating label */}
      <label
        className={clsx(
          "pointer-events-none absolute left-3 transition-all duration-200 ease-out",
          isActive
            ? "-top-2 text-xs bg-[#fcfdf6] px-1 text-black"
            : "top-1/2 -translate-y-1/2 text-neutral-500"
        )}
      >
        {placeholder}
      </label>
    </div>
  );
}
