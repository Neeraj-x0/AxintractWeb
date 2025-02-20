import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChannelSelector from "./ChannelSelector";
import { AttachmentSection } from "./Modal/AttachmentSection";
import { MessageConfiguration } from "./Modal/MessageConfiguration";
import PosterGenerator from "./PosterGenerator";
import { ExtendedFormData, useEngagementForm } from "./hooks/useReminderForm";
import { Channel, EngagementPopupProps } from "./Modal/types";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { ReminderDetails } from "./ReminderDetails";

const EngagementPopup: React.FC<EngagementPopupProps> = ({
  isOpen,
  onClose,
  engagementId,
}) => {
  const [channelState, setChannelState] = useState<Record<Channel, boolean>>({
    whatsapp: false,
    email: false,
  });
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [showPosterGenerator, setShowPosterGenerator] = useState(false);

  const { formData, setFormData, isLoading, error, success, handleSubmit } =
    useEngagementForm({ engagementId, setAttachmentFile });

  const handleChannelToggle = (channel: Channel) => {
    setChannelState((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };
  const setGeneratePoster = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, generatePoster: checked }));
  };

  const handleAttachmentToggle = (enabled: boolean) => {
    setHasAttachment(enabled);
    if (!enabled) {
      setAttachmentFile(null);
      setGeneratePoster(false);
      setFormData((prev) => ({
        ...prev,
        attachmentFile: null,
        posterGenerated: false,
      }));
    }
  };

  const handleFileUpload = (file: File | null) => {
    setAttachmentFile(file);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.channels = channelState;
    formData.attachmentFile = attachmentFile;
    handleSubmit(e);
  };

  const handlePosterGenerated = (
    icon: File,
    background: File,
    note: string,
    title: string
  ) => {
    setShowPosterGenerator(false);
    setFormData((prev: ExtendedFormData) => ({
      ...prev,
      poster: {
        icon,
        background,
        note,
        title,
      },
      posterGenerated: true,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] w-[90vw] p-0 gap-0">
        <div className="sticky top-0 z-10 bg-white border-b">
          <DialogTitle className="p-4 sm:p-6 text-xl font-semibold">
            Set Reminder
          </DialogTitle>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="overflow-y-auto max-h-[80vh]"
        >
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <ReminderDetails
              formData={formData}
              onFormChange={(data) =>
                setFormData((prev) => ({ ...prev, ...data }))
              }
              currentDate={new Date().toISOString()}
            />
            <ChannelSelector
              selectedChannels={channelState}
              onChannelToggle={handleChannelToggle}
            />

            <AttachmentSection
              hasAttachment={hasAttachment}
              attachmentFile={attachmentFile}
              formData={formData}
              onAttachmentToggle={handleAttachmentToggle}
              onGeneratePoster={(checked) => {
                setGeneratePoster(checked);
                if (checked) {
                  setShowPosterGenerator(true);
                  setAttachmentFile(null);
                }
              }}
              onFileUpload={handleFileUpload}
            />

            <MessageConfiguration
              selectedChannels={channelState}
              formData={formData}
              attachmentFile={attachmentFile}
              setFormData={(data) =>
                setFormData((prev) => ({ ...prev, ...data }))
              }
            />

            {(error || success.success) && (
              <AlertBanner
                type={error ? "error" : "success"}
                message={error || success.message}
              />
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary w-full sm:w-auto"
              disabled={
                isLoading || (!channelState.whatsapp && !channelState.email)
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>

        {showPosterGenerator && (
          <Dialog
            open={showPosterGenerator}
            onOpenChange={() => {
              setShowPosterGenerator(false);
              setGeneratePoster(false);
            }}
          >
            <DialogContent className="sm:max-w-[800px]">
              <DialogTitle className="p-6 text-xl font-semibold">
                Add Poster
              </DialogTitle>
              <PosterGenerator
                onPosterGenerated={handlePosterGenerated}
                onClose={() => {
                  setShowPosterGenerator(false);
                  setGeneratePoster(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EngagementPopup;
