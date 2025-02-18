import { useState, useCallback,  useEffect } from 'react';
import { IEngagement } from '@/types';

interface AnalyticsData {
  engagementScore: number;
  responseRate: string;
  messageStats: {
    total: number;
    replies: number;
    unread: number;
    lastMessage: string | null;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
  trends: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export const useAnalytics = (engagement: IEngagement) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    engagementScore: 0,
    responseRate: "0%",
    messageStats: {
      total: 0,
      replies: 0,
      unread: 0,
      lastMessage: null,
    },
    recentActivities: [],
    trends: {
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
  });

  const calculateAnalytics = useCallback(() => {
    const score = Math.round(
      (engagement.replies / engagement.totalMessages) * 100
    ) || 0;

    return {
      engagementScore: score,
      responseRate: `${score}%`,
      messageStats: {
        total: engagement.totalMessages,
        replies: engagement.replies,
        unread: 0, // This should come from the engagement data
        lastMessage: engagement.lastMessage ? new Date(engagement.lastMessage).toISOString() : null,
      },
      recentActivities: [], // This should be populated from the backend
      trends: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
    };
  }, [engagement]);

  const updateAnalytics = useCallback(() => {
    const newAnalytics = calculateAnalytics();
    setAnalytics(newAnalytics);
  }, [calculateAnalytics]);

  useEffect(() => {
    updateAnalytics();
  }, [engagement, updateAnalytics]);

  return {
    analytics,
    updateAnalytics,
  };
};