import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  ListChecks,
  FileText,
  Users,
  BarChart,
  Calendar,
  Download
} from 'lucide-react';

interface Action {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}

const ACTIONS: Action[] = [
  {
    icon: ListChecks,
    label: "Update Status",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: FileText,
    label: "Add Notes",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Users,
    label: "Assign Team",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: BarChart,
    label: "View Analytics",
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    icon: Calendar,
    label: "Schedule Follow-up",
    color: "bg-gray-50 text-gray-600"
  },
  {
    icon: Download,
    label: "Export Data",
    color: "bg-indigo-50 text-indigo-600"
  }
];

interface ActionButtonProps {
  action: Action;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(({ action }) => {
  const { icon: Icon, label, color } = action;
  
  return (
    <button
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50"
      onClick={action.onClick}
    >
      <div className={`p-3 rounded-lg ${color} mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

interface ActionCenterProps {
  className?: string;
}

export const ActionCenter: React.FC<ActionCenterProps> = React.memo(({ className }) => (
  <Card className={className}>
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 my-4">
        Actions & Tasks
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ACTIONS.map((action, index) => (
          <ActionButton key={index} action={action} />
        ))}
      </div>
    </CardContent>
  </Card>
));

ActionCenter.displayName = 'ActionCenter';

export default ActionCenter;