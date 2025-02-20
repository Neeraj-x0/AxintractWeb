import {  useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/label";
import { Card } from "@/components/ui/card";
type FormData = import("../hooks/useEngagementForm").ExtendedFormData;
type FormDataType = FormData;
import EmailConfig from "./EmailConfig";
import WhatsAppConfig from "./WhatsAppConfig";
import PosterGenerator from "./PosterGenerator";
import { FileUpload } from "./FileUpload";
import {
  
  useEngagementForm,
} from "../hooks/useEngagementForm";
import Image from "next/image";

interface EngagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  engagementId?: string;
}

type Channel = "whatsapp" | "email";

const EngagementPopup = ({
  isOpen,
  onClose,
  engagementId,
}: EngagementPopupProps) => {
  // Use an object instead of array for better state management
  const [channelState, setChannelState] = useState<Record<Channel, boolean>>({
    whatsapp: false,
    email: false,
  });
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [showPosterGenerator, setShowPosterGenerator] = useState(false);
 

  const { formData, setFormData, isLoading, error, success, handleSubmit } =
    useEngagementForm({ engagementId,setAttachmentFile });


  const selectedChannels: Channel[] = Object.entries(channelState)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, isSelected]) => isSelected)
    .map(([channel]) => channel as Channel);

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
    setFormData((prev: FormDataType) => ({
      ...prev,
      attachmentFile: file,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.channels = selectedChannels;
    handleSubmit(e);
  };

  const handlePosterGenerated = (
    icon: File,
    background: File,
    note: string,
    title: string
  ) => {
    setShowPosterGenerator(false);
    setFormData((prev: FormData) => ({
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
          <DialogTitle className="p-6 text-xl font-semibold">
            Send Message
          </DialogTitle>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="overflow-y-auto max-h-[80vh]"
        >
          <div className="p-6 space-y-6">
            {/* Channel Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Channels</h3>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <Switch
                    checked={channelState.whatsapp}
                    onCheckedChange={() => handleChannelToggle("whatsapp")}
                  />
                  <span>Whatsapp</span>
                </div>
                <div className="flex gap-2">
                  <Switch
                    checked={channelState.email}
                    onCheckedChange={() => handleChannelToggle("email")}
                  />
                  <span>Email</span>
                </div>
              </div>
            </Card>

            {/* Rest of the component remains the same */}
            {/* Attachment Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Attachment Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      key="attachment-toggle"
                      checked={hasAttachment}
                      onCheckedChange={handleAttachmentToggle}
                    />
                    <Label htmlFor="attachment-toggle">
                      Include Attachment
                    </Label>
                  </div>

                  {hasAttachment && !formData.generatePoster && (
                    <div className="flex items-center space-x-3">
                      <Switch
                        key="poster-toggle"
                        checked={formData.generatePoster}
                        onCheckedChange={(checked) => {
                          setGeneratePoster(checked);
                          if (checked) {
                            setShowPosterGenerator(true);
                            setAttachmentFile(null);
                          }
                        }}
                      />
                      <Label htmlFor="poster-toggle">
                        Generate Custom Poster
                      </Label>
                    </div>
                  )}
                </div>

                {hasAttachment && !formData.generatePoster && (
                  <FileUpload
                    onChange={handleFileUpload}
                    accept="image/*,video/*,application/pdf"
                    maxSize={5}
                    className="w-full"
                    value={attachmentFile}
                    helperText="Upload a file (Max 5MB)"
                  />
                )}

                {hasAttachment && formData.generatePoster && (
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {formData.poster && (
                          <>
                            {formData.poster.icon && (
                              <div>
                                <Label>Icon</Label>
                                <Image
                                  src={URL.createObjectURL(
                                    formData.poster.icon
                                  )}
                                  alt="Icon Preview"
                                  className="w-20 h-20 object-cover rounded"
                                  width={20}
                                  height={20}
                                />
                              </div>
                            )}
                            {formData.poster.background && (
                              <div>
                                <Label>Background</Label>
                                <Image
                                  src={URL.createObjectURL(
                                    formData.poster.background
                                  )}
                                  alt="Background Preview"
                                  className="w-20 h-20 object-cover rounded"
                                  width={20}
                                  height={20}
                                />
                              </div>
                            )}
                            <div className="col-span-2">
                              <Label>Title</Label>
                              <p className="text-sm text-gray-600">
                                {formData.poster.title}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <Label>Note</Label>
                              <p className="text-sm text-gray-600">
                                {formData.poster.note}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Message Configuration */}
            <div className="grid grid-cols-1 gap-6">
              {selectedChannels.map((channel) => (
                <Card key={channel} className="p-6">
                  {channel === "whatsapp" && (
                    <WhatsAppConfig
                      formData={{
                        message: formData.message,
                        caption: formData.caption,
                        attachmentFile,
                        generatePoster: formData.generatePoster,
                      }}
                      setFormData={(whatsappData) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: whatsappData.message,
                          caption: whatsappData.caption,
                        }))
                      }
                    />
                  )}

                  {channel === "email" && (
                    <EmailConfig
                      hasAttachment={hasAttachment}
                      attachmentFile={attachmentFile}
                      formData={{
                        emailSubject: formData.emailSubject,
                        customHTML: formData.customHTML,
                        emailTitle: formData.emailData.note,
                        emailNote: formData.emailData.note,
                        templateId: formData.templateId,
                      }}
                      setFormData={(emailData: unknown) =>
                        setFormData((prev) => ({
                          ...prev,
                          ...(emailData as Partial<FormData>),
                        }))
                      }
                    />
                  )}
                </Card>
              ))}
            </div>

            {/* Alerts */}
            {(error || success) && (
              <div>
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                {success.success && (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                    {success.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons - Fixed at the bottom */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              disabled={isLoading || selectedChannels.length === 0}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>

        {/* Poster Generator Dialog */}
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
