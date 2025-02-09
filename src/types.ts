
import { Document, Types } from 'mongoose';


export interface Lead {
  id: string;
  fullName: string;
  email: string;
  score: number;
  category: "cold" | "warm" | "hot" | "vip";
  phone?: string;
  status: string;
  lastActive: string;
  note: string;
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

export interface Engagement {
  id?: string;
  name: string;
  totalMessages: number;
  replies: number;
  status?: string 
  category: string;
  lastContacted?: string;
  notes: string;

}

export interface BusinessProfile {
  companyName: string;
  companyLogo: string;
  phoneNumber: string;
}



// Base Engagement interface
export interface IEngagement {
  _id?: Types.ObjectId;
  name: string;
  notes?: string;
  lastMessage?: Date;
  category?: string;
  user?: string | Types.ObjectId;
  status?: string;
  messages?: Types.ObjectId[] | string[];
  timestamp?: Date;
  totalMessages: number;
  replies: number;
}

// For Mongoose Document
export interface IEngagementDocument extends Document, Omit<IEngagement, '_id'> {}

// Props for the CreateEngagementPopup component
export interface CreateEngagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IEngagement) => Promise<void>;
  categories?: string[];
  statuses?: string[];
}

// Category Section Type
export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategorySections {
  [key: string]: CategoryOption[];
}

// API Response Type
export interface APIResponse<T> {
  status: 'success' | 'error';
  statuses?: string[];
  categories?: string[];
  data ?: T;
  message?: string;
}

// For Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string | Types.ObjectId;
    email: string;
    name?: string;
  };
}

// Engagement Filter Type
export interface EngagementFilter {
  status?: string;
  category?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string | Types.ObjectId;
}

// Engagement Statistics
export interface EngagementStats {
  totalEngagements: number;
  totalMessages: number;
  totalReplies: number;
  responseRate: number;
  categoryDistribution: {
    [key: string]: number;
  };
  statusDistribution: {
    [key: string]: number;
  };
}
