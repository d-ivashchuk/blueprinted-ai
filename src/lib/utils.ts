import { type ClassValue, clsx } from "clsx";
import { env } from "~/env.mjs";

import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: options.month ?? "long",
    day: options.day ?? "numeric",
    year: options.year ?? "numeric",
    ...options,
  }).format(new Date(date));
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}

export const currency = "€";

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`;
}

export function removeTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function getPlainUrl(fullUrl: string) {
  try {
    // Create a URL object
    const url = new URL(fullUrl);

    // Get the hostname (e.g., www.example.com or sub.example.com)
    const hostname = url.hostname;

    // Split the hostname into parts
    let parts = hostname.split(".");

    // Filter out common parts like 'www'
    parts = parts.filter((part) => part !== "www");

    // Join the remaining parts
    const plainUrl = parts.join(".");

    return plainUrl;
  } catch (error) {
    console.error("Invalid URL provided", error);
    return null;
  }
}

export const urlSchema = z.object({
  url: z
    .string()
    .refine(
      (value) => {
        // Check if the value contains a protocol
        const containsProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
        return containsProtocol || /^[^\s]+(\.[^\s]+)+$/.test(value);
      },
      {
        message: "Invalid URL format",
      },
    )
    .transform((value) => {
      // Prepend HTTPS protocol if it's missing or replace any existing protocol with HTTPS
      if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) {
        return `https://${value}`;
      }
      return value.replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:/, "https:");
    }),
});
