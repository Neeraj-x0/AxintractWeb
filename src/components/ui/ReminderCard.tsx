import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IoMdTrendingUp,IoIosTrendingDown } from "react-icons/io";

interface Stat {
  label: string;
  value: string | number;
  trendUp: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  trend: string;
}

const StyledStatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
          
          <div className="flex flex-col items-end align-middle space-y-3 mt-2">
            <div className={`p-3 rounded-xl transition-colors duration-200
              ${stat.trendUp 
                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {stat.icon && <stat.icon className="w-5 h-5" />}
            </div>
            
            <div className="flex items-center space-x-1">
              {stat.trendUp ? (
                <IoMdTrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <IoIosTrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold
                ${stat.trendUp 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.trend}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyledStatCard;