export interface Lead {
  notes: string;
  category: string;
  id: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  lastContacted?: string;
}

export interface ProgressionStage {
  title: string;
  description: string;
  count: number;
  color: string;
  icon: string;
}