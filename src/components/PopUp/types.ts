export type MessageType = "text" | "image" | "video" | "audio" | "document";
export type EmailBodyType = "text" | "html";
export type EmailServiceType = "mailgun" | "gmail";
export type Channel = "whatsapp" | "email";

export interface FORMData {
  // WhatsApp fields
  message: string;
  mediaType: MessageType;
  caption: string;
  file: File | null;

  // Email fields
  emailSubject: string;
  emailTemplate: string;
  emailBodyType: EmailBodyType;
  type: EmailServiceType;
  emailData: {
    title: string;
    note: string;
  };
  customHTML: string;
  templateId: string;
}

export interface EngagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  engagementId?: string;
  type?: string;
  defaultSubject?: string;
}