import React, { forwardRef } from "react";
import { useTextDirection } from "@/hooks/common/useTextDirection";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isLoading?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      isLoading,
      showCharCount = false,
      maxLength,
      minRows = 3,
      maxRows,
      value = "",
      rows,
      ...props
    },
    ref
  ) => {
    const { direction, textAlign } = useTextDirection(String(value));

    const currentLength = String(value).length;

    // Calculate dynamic rows if maxRows is provided
    const calculateRows = () => {
      if (rows) return rows;

      const lineCount = String(value).split("\n").length;
      const estimatedRows = Math.max(
        minRows,
        Math.min(lineCount + 1, maxRows || lineCount + 1)
      );
      return estimatedRows;
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            className={cn(
              "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500",
              "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "resize-vertical transition-all duration-200",
              "min-h-[120px]",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            style={{
              direction,
              textAlign,
            }}
            ref={ref}
            disabled={isLoading || props.disabled}
            value={value}
            rows={calculateRows()}
            maxLength={maxLength}
            {...props}
          />

          {isLoading && (
            <div className="absolute top-3 right-3">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-sm text-red-400">{error}</p>}

            {helperText && !error && (
              <p className="text-sm text-zinc-500">{helperText}</p>
            )}
          </div>

          {(showCharCount || maxLength) && (
            <p
              className={cn(
                "text-xs",
                maxLength && currentLength > maxLength * 0.9
                  ? currentLength >= maxLength
                    ? "text-red-400"
                    : "text-yellow-400"
                  : "text-zinc-500"
              )}
            >
              {currentLength}
              {maxLength && `/${maxLength}`} characters
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
