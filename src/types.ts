export interface Lead {
  id: string;
  fullName: string;
  email: string;
  score: number;
  category: "cold" | "warm" | "hot" | "vip";
  phone?: string;
  source: string;
  status: string;
  nextAction: string;
  lastActive: string;
  emailMetrics: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  tags: string[];
  funnelStage: string;
}

export interface Communication {
  id: string;
  type: "email" | "call" | "message";
  date: string;
  content: string;
}

export interface Campaign {
  id: string;
  name: string;
  performance: {
    openRate: number;
    clickRate: number;
  };
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  datetime: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "upcoming" | "overdue";
  starred: boolean;
  recurrence?: string;
  category: string;
  assignedTo: string[];
  tags: string[];
}
