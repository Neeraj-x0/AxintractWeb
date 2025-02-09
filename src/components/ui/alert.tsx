"use client";
import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "success" | "error" | "warning" | "info";
type AlertSize = "sm" | "md" | "lg";

interface AlertProps {
  title?: string;
  description?: string | React.ReactNode;
  variant?: AlertVariant;
  size?: AlertSize;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  show?: boolean;
}

const getAlertStyles = (variant: AlertVariant) => {
  const styles = {
    default: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
    success: "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
    error: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    warning: "bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100",
    info: "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
  };

  const iconColors = {
    default: "text-gray-500 dark:text-gray-400",
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-blue-500 dark:text-blue-400"
  };

  return {
    container: styles[variant],
    icon: iconColors[variant]
  };
};

const getSizeStyles = (size: AlertSize) => {
  const styles = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg"
  };
  return styles[size];
};

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = "default",
  size = "md",
  icon,
  className,
  onClose,
  show = true
}) => {
  if (!show) return null;

  const { container: containerStyles, icon: iconStyles } = getAlertStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const defaultIcon = {
    success: <CheckCircle className={cn("h-5 w-5", iconStyles)} />,
    error: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    warning: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    info: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    default: <AlertCircle className={cn("h-5 w-5", iconStyles)} />
  }[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative rounded-lg border transition-all",
        containerStyles,
        sizeStyles,
        className
      )}
    >
      <div className="flex gap-3">
        {(icon || defaultIcon) && (
          <div className="flex-shrink-0">{icon || defaultIcon}</div>
        )}
        <div className="flex-1">
          {title && <h5 className="font-medium mb-1">{title}</h5>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// AlertDescription component
const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm opacity-90">{children}</div>
);




export { Alert, AlertDescription };