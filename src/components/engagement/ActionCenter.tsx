import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ListChecks,
  FileText,
  Users,
  BarChart,
  Calendar,
  Download,
  ExternalLink,
} from "lucide-react";
import { MotionButton, MotionDiv } from "../MotionComponents";

interface Action {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  hoverColor: string;
  description: string;
  onClick?: () => void;
  comingSoon?: boolean;
}

const ACTIONS: Action[] = [
  {
    icon: ListChecks,
    label: "Update Status",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    description: "Change the current status of this engagement",
    comingSoon: true,
  },
  {
    icon: FileText,
    label: "Add Notes",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    description: "Add important notes and comments",
    comingSoon: true,
  },
  {
    icon: Users,
    label: "Assign Team",
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    description: "Assign team members to this engagement",
    comingSoon: true,
  },
  {
    icon: BarChart,
    label: "View Analytics",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    hoverColor: "hover:bg-yellow-100",
    description: "See detailed performance metrics",
    comingSoon: true,
  },
  {
    icon: Calendar,
    label: "Schedule Follow-up",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    hoverColor: "hover:bg-gray-100",
    description: "Plan your next follow-up action",
    comingSoon: true,
  },
  {
    icon: Download,
    label: "Export Data",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
    description: "Download engagement data",
    comingSoon: true,
  },
];

interface ActionButtonProps {
  action: Action;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(({ action }) => {
  const {
    icon: Icon,
    label,
    color,
    bgColor,
    hoverColor,
    description,
    comingSoon,
  } = action;

  return (
    <MotionButton
      className={`group relative flex flex-col items-start p-4 rounded-xl 
        transition-all duration-200 border border-gray-100
        ${comingSoon ? "opacity-75" : "hover:shadow-md"} 
        ${hoverColor} w-full h-full min-h-[120px] bg-white`}
      whileHover={comingSoon ? {} : { scale: 1.02 }}
      whileTap={comingSoon ? {} : { scale: 0.98 }}
      onClick={action.onClick}
    >
      <div
        className={`${bgColor} ${color} p-3 rounded-lg mb-3
          transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-start space-y-1">
        <span className={`text-sm font-semibold ${color}`}>{label}</span>
        <span className="text-xs text-gray-500 line-clamp-2">
          {description}
        </span>
      </div>

      {comingSoon && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Coming Soon
          </span>
        </div>
      )}

      {!comingSoon && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className={`w-4 h-4 ${color}`} />
        </div>
      )}
    </MotionButton>
  );
});

interface ActionCenterProps {
  className?: string;
}

export const ActionCenter: React.FC<ActionCenterProps> = React.memo(
  ({ className }) => {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1 },
    };

    return (
      <Card className={className}>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex pt-4 items-center justify-between">
              <h3 className="text-xl  font-semibold text-gray-900">
                Actions & Tasks
              </h3>
              <span className="text-sm text-gray-500">
                {ACTIONS.filter((a) => !a.comingSoon).length} Available
              </span>
            </div>

            <MotionDiv
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {ACTIONS.map((action, index) => (
                <MotionDiv key={index} variants={item}>
                  <ActionButton action={action} />
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ActionButton.displayName = "ActionButton";
ActionCenter.displayName = "ActionCenter";

export default ActionCenter;
