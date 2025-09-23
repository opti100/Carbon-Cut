import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl(req?: Request): string {
  // Priority order for base URL detection:
  // 1. NEXT_PUBLIC_BASE_URL environment variable
  // 2. Vercel URL (for preview deployments)
  // 3. Construct from request headers
  // 4. Default fallback

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (req) {
    const host = req.headers.get("host");
    const protocol =
      req.headers.get("x-forwarded-proto") ||
      req.headers.get("x-forwarded-protocol") ||
      (host?.includes("localhost") ? "http" : "https");

    if (host) {
      return `${protocol}://${host}`;
    }
  }

  return "http://localhost:3000";
}
