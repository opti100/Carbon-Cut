"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

export interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder: string;
  options: Option[];
  size?: "small" | "medium" | "big";
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Dropdown({
  placeholder,
  options,
  size = "medium",
  label,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  /* Sync controlled value → internal state */
  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.value === value);
      setSelected(match ?? null);
    }
  }, [value, options]);

  const sizeStyles = {
    small: "h-9 px-3 text-sm",
    medium: "h-11 px-3 text-md",
    big: "h-14 px-4 text-base",
  };

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Label */}
      {label && (
        <span className="mb-1 block text-sm font-medium text-neutral-700">
          {label}
        </span>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex w-full items-center justify-between rounded-md border border-[#d1cebb] bg-[#fcfdf6] outline-none transition-all focus:border-black",
          sizeStyles[size]
        )}
      >
        <span className={clsx(selected ? "text-black" : "text-neutral-500")}>
          {selected ? selected.label : placeholder}
        </span>

        {/* Chevron */}
        <svg
          className={clsx(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-[#d1cebb] bg-[#fcfdf6] shadow-sm">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className="block w-full px-3 py-2 text-left text-md hover:bg-[#f5fbe6]"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
