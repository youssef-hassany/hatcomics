import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APIError = async (error: string) => {
  console.error(error);
  return NextResponse.json({
    status: "error",
    message: `Internal Server Error: ${error}`,
  });
};

export const NoUserError = async () => {
  return NextResponse.json(
    { status: "error", message: "User is not authorized or not found!" },
    { status: 401 }
  );
};

export const getPreview = (htmlContent: string, maxLength = 150) => {
  if (!htmlContent) return "";

  // Strip HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, "");

  // Get first N characters and add ellipsis if truncated
  return textContent.length > maxLength
    ? textContent.substring(0, maxLength) + "..."
    : textContent;
};

export const starGenerator = (rating: number) => {
  let stars = "";

  for (let i = 0; i < Math.floor(rating); i++) {
    stars += "★";
  }

  if (rating % 1 > 0) {
    stars += "½";
  }

  return stars;
};
