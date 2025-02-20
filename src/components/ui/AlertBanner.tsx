import React from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { MotionDiv } from "@/components/MotionComponents";

interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  className?: string;
}

const alertStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: AlertCircle,
    iconColor: "text-blue-500",
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  message,
  onClose,
  className = "",
}) => {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg border p-4 ${style.bg} ${style.border} ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${style.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className={`text-sm font-medium ${style.text}`}>{message}</div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${style.text} hover:${style.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${style.bg} focus:ring-${style.text}`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};