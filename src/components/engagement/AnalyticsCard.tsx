import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = React.memo(({
  title,
  value,
  icon: Icon,
  color,
  description,
}) => (
  <div className={`p-6 rounded-lg shadow-sm ${color} border border-opacity-20`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Icon className="w-6 h-6 opacity-75" />
    </div>
    <p className="text-sm opacity-75 mb-2">{description}</p>
    <span className="text-3xl font-bold">{value}</span>
  </div>
));

AnalyticsCard.displayName = 'AnalyticsCard';