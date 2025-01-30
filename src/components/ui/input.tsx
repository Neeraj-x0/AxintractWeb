import React from 'react';
import { cva } from 'class-variance-authority';

// Input Component
const inputVariants = cva(
  "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-200 focus:border-indigo-500",
        error: "border-red-500 focus:border-red-500",
        success: "border-green-500 focus:border-green-500",
      },
      size: {
        default: "h-10 py-2",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "error" | "success";
  inputSize?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className = "",
  variant,
  inputSize: size,
  icon,
  error,
  success,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
      )}
      <input
        className={inputVariants({
          variant: error ? "error" : success ? "success" : variant,
          size,
          className: `${icon ? "pl-10" : ""} ${className}`,
        })}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;