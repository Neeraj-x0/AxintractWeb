import React from "react";
import { Card } from "@/components/ui/card";
import WhatsAppConfig from "../WhatsAppConfig";
import EmailConfig from "../EmailConfig";
import { ExtendedFormData } from "../hooks/useEngagementForm";

interface FormData {
  message?: string;
  caption?: string;
  generatePoster?: boolean;
  emailSubject?: string;
  customHTML?: string;
  emailData?: {
    note: string;
  };
  templateId?: string;
}

interface SelectedChannels {
  whatsapp: boolean;
  email: boolean;
}

interface MessageConfigurationProps {
  selectedChannels: SelectedChannels;
  formData: FormData;
  attachmentFile: File | null;
  setFormData: (data: Partial<ExtendedFormData>) => void;
}

export const MessageConfiguration: React.FC<MessageConfigurationProps> = ({
  selectedChannels,
  formData,
  attachmentFile,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {Object.entries(selectedChannels).map(([channelType, isEnabled]) => {
        if (!isEnabled) return null;

        return (
          <Card key={channelType} className="p-4 sm:p-6">
            {channelType === "whatsapp" && (
              <WhatsAppConfig
                formData={{
                  message: formData.message || "",
                  caption: formData.caption || "",
                  attachmentFile,
                  generatePoster: formData.generatePoster || false,
                }}
                setFormData={(whatsappData) =>
                  setFormData({
                    message: whatsappData.message,
                    caption: whatsappData.caption,
                  })
                }
              />
            )}

            {channelType === "email" && (
              <EmailConfig
                hasAttachment={!!attachmentFile}
                attachmentFile={attachmentFile}
                formData={{
                  emailSubject: formData.emailSubject || "",
                  customHTML: formData.customHTML || "",
                  emailTitle: formData.emailData?.note || "",
                  emailNote: formData.emailData?.note || "",
                  templateId: formData.templateId || "",
                }}
                setFormData={(emailData) => {
                  if (typeof emailData === "object" && emailData !== null) {
                    setFormData(emailData as Partial<ExtendedFormData>);
                  }
                }}
              />
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MessageConfiguration;