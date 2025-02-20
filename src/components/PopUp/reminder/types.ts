export type MessageType = "text" | "image" | "video" | "audio" | "document";
export type Frequency = "once" | "daily" | "weekly" | "monthly";
export type Channel = "whatsapp" | "email";
import { FormDataState } from "../hooks/useReminderForm";
export interface EmailData {
  title: string;
  note: string;
}

export interface ReminderDetailsProps {
  formData: FormDataState;
  currentDate: string;
  onFormChange: (updates: Partial<FormDataState>) => void;
}