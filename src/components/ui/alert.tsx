"use client";
import React from "react";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";

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
    success:
      "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
    error: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    warning:
      "bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100",
    info: "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100",
  };

  const iconColors = {
    default: "text-gray-500 dark:text-gray-400",
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-blue-500 dark:text-blue-400",
  };

  return {
    container: styles[variant],
    icon: iconColors[variant],
  };
};

const getSizeStyles = (size: AlertSize) => {
  const styles = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };
  return styles[size];
};

const ToastContent: React.FC<{
  title?: string;
  description?: string | React.ReactNode;
  variant: AlertVariant;
  size: AlertSize;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, description, variant, size, icon, className }) => {
  const { container: containerStyles, icon: iconStyles } =
    getAlertStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const defaultIcon = {
    success: <CheckCircle className={cn("h-5 w-5", iconStyles)} />,
    error: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    warning: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    info: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
    default: <AlertCircle className={cn("h-5 w-5", iconStyles)} />,
  }[variant];

  return (
    <div className={cn("flex gap-3", containerStyles, sizeStyles, className)}>
      {(icon || defaultIcon) && (
        <div className="flex-shrink-0">{icon || defaultIcon}</div>
      )}
      <div className="flex-1">
        {title && <h5 className="font-medium mb-1">{title}</h5>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    </div>
  );
};

const Alert = ({
  title,
  description,
  variant = "default",
  size = "md",
  icon,
  className,
  onClose,
  show = true,
}: AlertProps) => {
  React.useEffect(() => {
    if (show) {
      const toastOptions = {
        position: "top-right" as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: onClose,
      };

      const toastContent = (
        <ToastContent
          title={title}
          description={description}
          variant={variant}
          size={size}
          icon={icon}
          className={className}
        />
      );

      switch (variant) {
        case "success":
          toast.success(toastContent, toastOptions);
          break;
        case "error":
          toast.error(toastContent, toastOptions);
          break;
        case "warning":
          toast.warning(toastContent, toastOptions);
          break;
        case "info":
          toast.info(toastContent, toastOptions);
          break;
        default:
          toast(toastContent, toastOptions);
      }
    }
  }, [show, title, description, variant, size, icon, className, onClose]);

  return null;
};

// AlertDescription component
const AlertDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="text-sm opacity-90">{children}</div>;

// ToastContainer configuration
const ToastContainerWrapper: React.FC = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
);

export { Alert, AlertDescription, ToastContainerWrapper };
