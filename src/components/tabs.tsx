import React, { Children, cloneElement,  ReactNode } from 'react';

interface TabsProps {
    value: string | number;
    onValueChange: (value: string | number) => void;
    children: ReactNode;
    className?: string;
}

interface TabsListProps {
    children: ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string | number;
    activeTab: string | number;
    onTabChange: (value: string | number) => void;
    children: ReactNode;
    className?: string;
}

interface TabsContentProps {
    value: string | number;
    activeTab: string | number;
    children: ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
    return (
        <div className={`tabs-container ${className}`}>
                    {Children.map(children, (child) =>
                                                child && React.isValidElement(child)
                                                    ? cloneElement(child as React.ReactElement<{ activeTab: string | number; onTabChange: (value: string | number) => void }>, {
                                                            activeTab: value,
                                                            onTabChange: onValueChange
                                                        })
                                                    : child
                                            )}
        </div>
    );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return <div className={`tabs-list flex space-x-4 ${className}`}>{children}</div>;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    activeTab,
    onTabChange,
    children,
    className = ''
}) => {
    const isActive = value === activeTab;
    return (
        <button
            className={`tabs-trigger px-4 py-2 border rounded ${
                isActive ? 'bg-blue-500 text-white' : 'bg-white text-black'
            } ${className}`}
            onClick={() => onTabChange(value)}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children, className = '' }) => {
    if (value !== activeTab) return null;
    return <div className={`tabs-content p-4 ${className}`}>{children}</div>;
};