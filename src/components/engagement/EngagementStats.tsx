import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IEngagement } from '@/types';

interface EngagementStatsProps {
  engagement: IEngagement;
}

interface StatItemProps {
  label: string;
  value: number | string;
}

const StatItem: React.FC<StatItemProps> = React.memo(({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-semibold text-gray-900">{value}</div>
  </div>
));

StatItem.displayName = 'StatItem';

export const EngagementStats: React.FC<EngagementStatsProps> = React.memo(({ engagement }) => {
  const stats = useMemo(() => {
    const engagementScore = Math.round((engagement.replies / engagement.totalMessages) * 100) || 0;
    
    return {
      score: engagementScore,
      responseRate: `${engagementScore}%`,
      totalMessages: engagement.totalMessages,
      replies: engagement.replies
    };
  }, [engagement.replies, engagement.totalMessages]);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 my-4">
          Engagement Score
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Response Rate</span>
            <span className="text-lg font-semibold text-indigo-600">
              {stats.score}/100
            </span>
          </div>
          
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.score}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <StatItem label="Total Messages" value={stats.totalMessages} />
            <StatItem label="Total Replies" value={stats.replies} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EngagementStats.displayName = 'EngagementStats';

export default EngagementStats;