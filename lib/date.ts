/**
 * Date formatting utilities for frontend applications
 * Handles ISO datetime strings like: 2025-08-03T17:12:14.7334858
 */

// Type definitions
export type DateInput = string | Date | number;

export interface CustomFormatOptions {
  weekday?: "narrow" | "short" | "long";
  era?: "narrow" | "short" | "long";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZoneName?: "short" | "long";
  hour12?: boolean;
}

export type FormatterFunction = (dateString: DateInput) => string;

// Helper function to ensure Date object
const toDate = (dateInput: DateInput): Date => {
  return new Date(dateInput);
};

// Basic formatting functions
export const formatDate = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleDateString();
};

export const formatTime = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleTimeString();
};

export const formatDateTime = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleString();
};

// Specific format functions
export const formatDateShort = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateLong = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime12Hour = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTime24Hour = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Relative time functions
export const getTimeAgo = (dateString: DateInput): string => {
  const date = toDate(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateShort(dateString);
};

export const isToday = (dateString: DateInput): boolean => {
  const date = toDate(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (dateString: DateInput): boolean => {
  const date = toDate(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Custom format functions
export const formatCustom = (
  dateString: DateInput,
  options: CustomFormatOptions = {}
): string => {
  const date = toDate(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const formatDateOnly = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

export const formatForInput = (dateString: DateInput): string => {
  const date = toDate(dateString);
  return date.toISOString().slice(0, 16); // Returns YYYY-MM-DDTHH:mm for datetime-local input
};

// Smart formatting based on context
export const formatSmart = (dateString: DateInput): string => {
  if (isToday(dateString)) {
    return `Today at ${formatTime12Hour(dateString)}`;
  }
  if (isYesterday(dateString)) {
    return `Yesterday at ${formatTime12Hour(dateString)}`;
  }

  const date = toDate(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return formatDateShort(dateString);
};

// Utility functions
export const isValidDate = (dateString: DateInput): boolean => {
  const date = toDate(dateString);
  return !isNaN(date.getTime());
};

export const safeFormat = (
  dateString: DateInput | null | undefined,
  formatter: FormatterFunction = formatDateTime
): string => {
  if (!dateString) return "N/A";
  if (!isValidDate(dateString)) return "Invalid Date";
  return formatter(dateString);
};

// Constants for common formats
export const DATE_FORMATS = {
  SHORT: formatDateShort,
  LONG: formatDateLong,
  TIME_12: formatTime12Hour,
  TIME_24: formatTime24Hour,
  DATETIME: formatDateTime,
  SMART: formatSmart,
  DATE_ONLY: formatDateOnly,
  INPUT: formatForInput,
} as const;

// Type for the format constants
export type DateFormatType = keyof typeof DATE_FORMATS;

// Advanced utility: Format with locale support
export const formatWithLocale = (
  dateString: DateInput,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const date = toDate(dateString);
  return date.toLocaleDateString(locale, options);
};

// Example usage with types:
/*
const exampleDate: DateInput = '2025-08-03T17:12:14.7334858';

console.log(formatDate(exampleDate));         // 8/3/2025
console.log(formatTime(exampleDate));         // 5:12:14 PM
console.log(formatDateTime(exampleDate));     // 8/3/2025, 5:12:14 PM
console.log(formatDateShort(exampleDate));    // Aug 3, 2025
console.log(formatDateLong(exampleDate));     // Sunday, August 3, 2025
console.log(formatTime12Hour(exampleDate));   // 5:12 PM
console.log(formatTime24Hour(exampleDate));   // 17:12
console.log(getTimeAgo(exampleDate));         // Will show relative time
console.log(formatSmart(exampleDate));        // Context-aware formatting

// Using with different input types
console.log(formatDate(new Date()));          // Works with Date objects
console.log(formatDate(Date.now()));          // Works with timestamps

// Using constants
console.log(DATE_FORMATS.SHORT(exampleDate)); // Aug 3, 2025

// Type-safe custom formatting
const customOptions: CustomFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'short'
};
console.log(formatCustom(exampleDate, customOptions));
*/
