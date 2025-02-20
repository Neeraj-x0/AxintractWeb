"use client";
import { memo } from "react";
import { Upload, Users, MessageSquare } from "lucide-react";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  step: number;
}

const QuickActionButton = memo(({ icon, label, description, step }: QuickActionProps) => (
  <button className="flex flex-col items-start p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group h-full shadow-md hover:shadow-lg w-full">
    <div className="flex items-center mb-3">
      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-200">
        {icon}
      </div>
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        Step {step}
      </span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2 text-base sm:text-lg group-hover:text-blue-700">
      {label}
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
  </button>
));

const QuickActions = () => {
  const steps = [
    {
      icon: <Upload size={20} />,
      label: "Import Leads",
      description:
        "Upload Excel/CSV files or manually add leads with name, phone, email, and notes.",
      step: 1,
    },
    {
      icon: <Users size={20} />,
      label: "Manage Leads",
      description:
        "Categorize and set lead status to organize your engagement strategy.",
      step: 2,
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Engage & Convert",
      description:
        "Send personalized messages via WhatsApp and email using AI assistance.",
      step: 3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {steps.map((step, index) => (
        <QuickActionButton key={index} {...step} />
      ))}
    </div>
  );
};

QuickActionButton.displayName = "QuickActionButton";
export default QuickActions;