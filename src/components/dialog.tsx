import React from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

/**
 * Dialog component to display a modal.
 * When `open` is false, nothing is rendered.
 * Clicking on the overlay will trigger `onOpenChange(false)` to close the dialog.
 */
export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
            >
                {children}
            </div>
        </div>
    );
};

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * DialogContent wraps the main content area.
 */
export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
    return <div className={`dialog-content ${className}`}>{children}</div>;
};

interface DialogHeaderProps {
    children: React.ReactNode;
}

/**
 * DialogHeader is used at the top of the dialog.
 */
export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
    return <div className="dialog-header mb-4">{children}</div>;
};

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * DialogTitle displays the title of the dialog.
 */
export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => {
    return <h2 className={`dialog-title text-xl font-bold ${className}`}>{children}</h2>;
};