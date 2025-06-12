import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 focus:outline-none cursor-pointer";

  const variantStyles = {
    primary: "bg-orange-600 hover:bg-orange-700",
    secondary: "bg-zinc-700 hover:bg-zinc-800",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      ) : (
        children
      )}
    </button>
  );
};
