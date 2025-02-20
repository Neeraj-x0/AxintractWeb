import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/label";
import { FileUpload } from "../FileUpload";
import { PosterPreview } from "./PosterPreview";
import { ExtendedFormData } from "../../hooks/useEngagementForm";
import { PosterData } from "./types";


interface AttachmentSectionProps {
  hasAttachment: boolean;
  attachmentFile: File | null;
  formData: ExtendedFormData;
  onAttachmentToggle: (enabled: boolean) => void;
  onGeneratePoster: (enabled: boolean) => void;
  onFileUpload: (file: File | null) => void;
}

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  hasAttachment,
  attachmentFile,
  formData,
  onAttachmentToggle,
  onGeneratePoster,
  onFileUpload,
}) => {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-4">Attachment Settings</h3>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Switch
              checked={hasAttachment}
              onCheckedChange={onAttachmentToggle}
            />
            <Label>Include Attachment</Label>
          </div>

          {hasAttachment && !formData.generatePoster && (
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.generatePoster}
                onCheckedChange={onGeneratePoster}
              />
              <Label>Generate Custom Poster</Label>
            </div>
          )}
        </div>

        {hasAttachment && !formData.generatePoster && (
          <FileUpload
            onChange={onFileUpload}
            accept="image/*,video/*,application/pdf"
            maxSize={5}
            className="w-full"
            value={attachmentFile}
            helperText="Upload a file (Max 5MB)"
          />
        )}

        {hasAttachment && formData.generatePoster && formData.poster && formData.poster.icon && formData.poster.background && (
          <PosterPreview poster={formData.poster as PosterData} />
        )}
      </div>
    </Card>
  );
};
