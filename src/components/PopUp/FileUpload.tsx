import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";

export interface FileUploadProps {
  /**
  </div> * File types to accept (e.g., "image/*,video/*,.pdf")
   */
  accept?: string;
  /**
   * Maximum file size in MB
   */
  maxSize?: number;
  /**
   * Currently selected file
   */
  value?: File | null;
  /**
   * Callback fired when file is selected or removed
   */
  onChange?: (file: File | null) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the upload is disabled
   */
  disabled?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Helper text to display below the upload area
   */
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 10, // Default max size is 10MB
  value,
  onChange,
  className,
  disabled = false,
  error,
  helperText,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setLocalError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split(".").pop()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          // Handle wildcard mime types (e.g., "image/*")
          const baseType = type.split("/")[0];
          return fileType.startsWith(`${baseType}/`);
        }
        // Handle specific extensions or mime types
        return type === fileType || type === fileExtension;
      });

      if (!isAccepted) {
        setLocalError(`File type must be: ${accept}`);
        return false;
      }
    }

    setLocalError("");
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onChange?.(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onChange?.(file);
      }
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
    setLocalError("");
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors duration-200",
          {
            "border-gray-300 bg-gray-50 hover:border-gray-400":
              !disabled && !isDragActive && !error && !localError,
            "border-blue-400 bg-blue-50": isDragActive,
            "border-red-300 bg-red-50": error || localError,
            "border-gray-200 bg-gray-100 cursor-not-allowed": disabled,
          }
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center p-6 text-center">
          {value ? (
            <div className="w-full">
              <div className="flex items-center justify-between gap-2 rounded-md bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <FiFile className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {value.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(value.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={disabled}
                  className={cn(
                    "rounded-full p-1 transition-colors hover:bg-gray-100",
                    {
                      "cursor-not-allowed opacity-50": disabled,
                    }
                  )}
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !disabled && fileInputRef.current?.click()}
              className={cn("cursor-pointer space-y-2", {
                "cursor-not-allowed": disabled,
              })}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FiUpload
                  className={cn("h-6 w-6", {
                    "text-gray-600": !disabled,
                    "text-gray-400": disabled,
                  })}
                />
              </div>
              <div className="space-y-1">
                <p
                  className={cn("text-sm font-medium", {
                    "text-gray-700": !disabled,
                    "text-gray-400": disabled,
                  })}
                >
                  <span>Drop a file or click to upload</span>
                </p>
                {accept && (
                  <p className="text-xs text-gray-500">
                    Accepted formats: {accept}
                  </p>
                )}
                {maxSize && (
                  <p className="text-xs text-gray-500">
                    Maximum size: {maxSize}MB
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error or Helper Text */}
      {(error || localError || helperText) && (
        <div className="flex items-start gap-2">
          {(error || localError) && (
            <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          )}
          <span
            className={cn("text-sm", {
              "text-red-500": error || localError,
              "text-gray-500": !error && !localError,
            })}
          >
            {error || localError || helperText}
          </span>
        </div>
      )}
    </div>
  );
};