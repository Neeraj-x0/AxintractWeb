export type MessageType = "text" | "image" | "video" | "audio" | "document";
export type Frequency = "once" | "daily" | "weekly" | "monthly";
export type Channel = "whatsapp" | "email";
import { ExtendedFormData } from "../hooks/useReminderForm";
export interface EmailData {
  title: string;
  note: string;
}

export interface ReminderDetailsProps {
  formData: ExtendedFormData;
  currentDate: string;
  onFormChange: (updates: Partial<ExtendedFormData>) => void;
}