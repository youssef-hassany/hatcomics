import React, { forwardRef } from "react";
import { useTextDirection } from "@/hooks/common/useTextDirection";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      isLoading,
      leftIcon,
      rightIcon,
      value = "",
      ...props
    },
    ref
  ) => {
    const { direction, textAlign } = useTextDirection(String(value));

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500",
              "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
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
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}

          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
