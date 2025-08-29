import { useState, useEffect } from "react";

export const useTextDirection = (text: string) => {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [textAlign, setTextAlign] = useState<"left" | "right">("left");

  useEffect(() => {
    if (!text.trim()) {
      setDirection("ltr");
      setTextAlign("left");
      return;
    }

    // Arabic Unicode range: U+0600 to U+06FF, U+0750 to U+077F, U+08A0 to U+08FF, U+FB50 to U+FDFF, U+FE70 to U+FEFF
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // Check the first non-whitespace character to determine initial direction
    const firstChar = text.trim()[0];
    const isArabicFirst = arabicRegex.test(firstChar);

    // Count Arabic vs Latin characters
    const arabicChars = (
      text.match(
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g
      ) || []
    ).length;
    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;

    // Determine direction based on first character and character count
    const shouldBeRTL =
      isArabicFirst || (arabicChars > latinChars && arabicChars > 0);

    setDirection(shouldBeRTL ? "rtl" : "ltr");
    setTextAlign(shouldBeRTL ? "right" : "left");
  }, [text]);

  return { direction, textAlign };
};
