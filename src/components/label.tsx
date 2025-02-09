import React, { ReactNode } from "react";

interface LabelProps {
    htmlFor: string;
    children?: ReactNode;
    className?: string;
}

/**
 * Label component for form elements.
 * The component accepts an htmlFor property which ties the label to an input element.
 */
export const Label: React.FC<LabelProps> = ({ htmlFor, children, className = '' }) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
            {children}
        </label>
    );
};