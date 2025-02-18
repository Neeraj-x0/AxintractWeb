import React from "react";
import { MessageCircle, Reply, Bell } from "lucide-react";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  color: string;
  type: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: MessageCircle,
    label: "Send Message",
    color: "bg-blue-50 text-blue-600",
    type: "message",
  },
  {
    icon: Reply,
    label: "Track Reply",
    color: "bg-green-50 text-green-600",
    type: "reply",
  },
  {
    icon: Bell,
    label: "Set Reminder",
    color: "bg-yellow-50 text-yellow-600",
    type: "reminder",
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
    const { icon: Icon, label, color } = action;

    return (
      <button
        onClick={onClick}
        className="flex items-center p-4 rounded-lg hover:bg-gray-50"
      >
        <div className={`p-3 rounded-lg ${color} mr-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export const QuickActions: React.FC<QuickActionsProps> = React.memo(
  ({ onAction }) => (
    <div className="grid grid-cols-2 max-w-[50vw] md:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map((action, index) => (
        <ActionButton
          key={index}
          action={action}
          onClick={() => onAction(action.type)}
        />
      ))}
    </div>
  )
);

QuickActions.displayName = "QuickActions";

export default QuickActions;
