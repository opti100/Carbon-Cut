"use client";

import { useState, useEffect, useRef } from "react";
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
  disabled?: boolean;
}

export default function Dropdown({
  placeholder,
  options,
  size = "medium",
  label,
  value,
  onChange,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  /* Sync controlled value */
  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.value === value);
      setSelected(match ?? null);
    }
  }, [value, options]);

  /* Reset highlight when search/open changes */
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search, open]);

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const sizeStyles = {
    small: "h-9 px-3 text-sm",
    medium: "h-11 px-3 text-md",
    big: "h-14 px-4 text-base",
  };

  const labelSizeStyles = {
    small: "text-xs",
    medium: "text-sm",
    big: "text-sm",
  };

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option.value);
    setOpen(false);
    setSearch("");
  };

  /* Keyboard handling */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (
      !open &&
      (e.key.length === 1 || e.key === "Enter" || e.key === "ArrowDown")
    ) {
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;

      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else {
          setOpen(false);
          setSearch("");
        }
        break;

      case "Escape":
        setOpen(false);
        setSearch("");
        break;

      case "Backspace":
        setSearch((prev) => prev.slice(0, -1));
        break;

      default:
        if (e.key.length === 1) {
          setSearch((prev) => prev + e.key);
        }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      {label && (
        <span
          className={clsx(
            "mb-2 block font-medium text-neutral-700",
            labelSizeStyles[size]
          )}
        >
          {label}
        </span>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={clsx(
          "flex w-full items-center justify-between rounded-lg border border-[#d1cebb] bg-[#fcfdf6] outline-none transition-all focus:border-black focus:ring-1 focus:ring-black",
          sizeStyles[size],
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className={clsx(selected ? "text-black" : "text-neutral-500")}>
          {selected
            ? selected.label
            : search
            ? search
            : placeholder}
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-[#d1cebb] bg-[#fcfdf6] shadow-lg">
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    "block w-full px-4 py-3 text-left text-base transition-colors",
                    index === highlightedIndex
                      ? "bg-[#6c5f31] text-white"
                      : "hover:bg-[#6c5f31] hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-neutral-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
