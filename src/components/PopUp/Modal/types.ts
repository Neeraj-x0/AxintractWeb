export type Channel = "whatsapp" | "email";

export interface PosterData {
  icon: File;
  background: File;
  note: string;
  title: string;
}

export interface FormData {
  message: string;
  caption: string;
  emailSubject: string;
  customHTML: string;
  emailData: {
    note: string;
  };
  templateId: string;
  channels: Channel[];
  generatePoster: boolean;
  attachmentFile: File | null;
  poster?: PosterData;
  posterGenerated?: boolean;
}

export interface EngagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  engagementId?: string;
}