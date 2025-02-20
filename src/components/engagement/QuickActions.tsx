import React from "react";
import { MessageCircle, Bell } from "lucide-react";
import { motion, MotionProps } from "framer-motion";
const MotionDiv = motion.div as React.FC<
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>;
interface QuickAction {
  icon: React.ElementType;
  label: string;
  color: string;
  hoverColor: string;
  bgColor: string;
  type: string;
  description?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: MessageCircle,
    label: "Send Message",
    color: "text-blue-600",
    hoverColor: "hover:bg-blue-100",
    bgColor: "bg-blue-50",
    type: "message",
    description: "Send a new message to this engagement",
  },
  {
    icon: Bell,
    label: "Set Reminder",
    color: "text-yellow-600",
    hoverColor: "hover:bg-yellow-100",
    bgColor: "bg-yellow-50",
    type: "reminder",
    description: "Set a reminder for follow-up",
  },
];

interface QuickActionsProps {
  onAction: (type: string) => void;
}

interface ActionButtonProps {
  action: QuickAction;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({ action, onClick }) => {
    const {
      icon: Icon,
      label,
      color,
      hoverColor,
      bgColor,
      description,
    } = action;

    const MotionButton = motion.button as React.FC<
      React.HTMLAttributes<HTMLButtonElement> & MotionProps
    >;

    return (
      <MotionButton
        onClick={onClick}
        className={`group flex flex-col sm:flex-row items-center p-3 sm:p-4 rounded-xl 
          transition-all duration-200 hover:shadow-md ${hoverColor} max-w-sm
          w-full border border-gray-100 hover:border-gray-200 bg-white`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className={`${bgColor} ${color} p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4
            transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <span className={`text-sm font-semibold ${color} mb-1`}>{label}</span>
          {description && (
            <span className="text-xs text-gray-500 text-center sm:text-left hidden sm:block">
              {description}
            </span>
          )}
        </div>
      </MotionButton>
    );
  }
);

export const QuickActions: React.FC<QuickActionsProps> = React.memo(
  ({ onAction }) => (
    <div className="max-w-3xl ">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
        {QUICK_ACTIONS.map((action, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ActionButton
              action={action}
              onClick={() => onAction(action.type)}
            />
          </MotionDiv>
        ))}
      </div>
    </div>
  )
);

ActionButton.displayName = "ActionButton";
QuickActions.displayName = "QuickActions";

export default QuickActions;
