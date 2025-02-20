import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  /**
   * Size variant of the toggle
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color variant of the toggle
   */
  variant?: "default" | "success" | "primary";
  /**
   * Optional label for the toggle
   */
  label?: string;
  /**
   * Whether to show the label
   */
  showLabel?: boolean;
  /**
   * Additional classes for the label
   */
  labelClassName?: string;

  className?: string;
}

export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(
  (
    {
      className,
      size = "md",
      variant = "default",
      label,
      showLabel = false,
      labelClassName,
      ...props
    },
    ref
  ) => {
    // Size configurations
    const sizes = {
      sm: {
        toggle: "h-5 w-9",
        thumb: "h-4 w-4 translate-x-0.5",
        thumbChecked: "translate-x-4",
      },
      md: {
        toggle: "h-6 w-11",
        thumb: "h-5 w-5 translate-x-0.5",
        thumbChecked: "translate-x-5",
      },
      lg: {
        toggle: "h-7 w-14",
        thumb: "h-6 w-6 translate-x-0.5",
        thumbChecked: "translate-x-7",
      },
    };

    // Color variants
    const variants = {
      default: {
        base: "bg-gray-200 hover:bg-gray-300",
        active: "bg-blue-600 hover:bg-blue-700",
      },
      success: {
        base: "bg-gray-200 hover:bg-gray-300",
        active: "bg-green-600 hover:bg-green-700",
      },
      primary: {
        base: "bg-gray-200 hover:bg-gray-300",
        active: "bg-indigo-600 hover:bg-indigo-700",
      },
    };

    return (
      <div className="flex items-center gap-2">
        {showLabel && label && (
          <label
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {label}
          </label>
        )}
        <TogglePrimitive.Root
          ref={ref}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            sizes[size].toggle,
            variants[variant].base,
            "data-[state=on]:" + variants[variant].active,
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
              sizes[size].thumb,
              "data-[state=on]:" + sizes[size].thumbChecked
            )}
          />
          {/* Visually hidden input for better accessibility */}
          <span className="sr-only">{label || "Toggle"}</span>
        </TogglePrimitive.Root>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
