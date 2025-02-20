"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, TrendingUp } from "lucide-react";
import { memo } from "react";

interface StatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const EngagementStat = memo(({ label, value, icon, change }: StatProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md">
    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>

    <div className="flex flex-col items-start sm:items-center space-y-1 sm:space-y-2">
      <span className="text-xs sm:text-sm text-gray-500">Change</span>
      <span
        className={`text-xs sm:text-sm font-medium ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
    </div>
  </div>
));

interface EngagementStatsProps {
  metrics: {
    responseRate: { value: number; change: string };
    avgResponseTime: { value: number; change: string };
    conversionRate: { value: number; change: string };
  };
}

const EngagementStats = ({ metrics }: EngagementStatsProps) => {
  const stats = [
    {
      label: "Response Rate",
      value: `${metrics.responseRate.value}%`,
      icon: <MessageSquare size={20} />,
      change: metrics.responseRate.change,
    },
    {
      label: "Avg Response Time",
      value: `${metrics.avgResponseTime.value} min`,
      icon: <Clock size={20} />,
      change: metrics.avgResponseTime.change,
    },
    {
      label: "Conversion Rate",
      value: `${metrics.conversionRate.value}%`,
      icon: <TrendingUp size={20} />,
      change: metrics.conversionRate.change,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-sm sm:text-base font-semibold">
          Engagement Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 bg-white">
        <div className="space-y-3 sm:space-y-4">
          {stats.map((stat, index) => (
            <EngagementStat key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

EngagementStat.displayName = "EngagementStat";
export default EngagementStats;