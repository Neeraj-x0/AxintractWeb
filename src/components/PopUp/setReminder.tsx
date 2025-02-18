import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/label";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "@/lib";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  engagementId?: string;
  type?: string;
  defaultSubject?: string;
}

type MessageType = "text" | "image" | "video" | "audio" | "document";
type Frequency = "once" | "daily" | "weekly" | "monthly";
type Channel = "whatsapp" | "email";

interface FormData {
  title: string;
  description: string;
  frequency: Frequency;
  scheduledAt: string;
  message: string;
  mediaType: MessageType;
  caption: string;
  file: File | null;
  emailSubject: string;
  engagementId: string;
  emailTemplate: string;
  emailBodyType: "text" | "html";
  type: "mailgun" | "gmail";
  emailData: {
    title: string;
    note: string;
  };
  customHTML: string;
  templateId: string;
}

const EngagementPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  engagementId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // UTC time handling functions
  const utcToLocalInputDateTime = (utcStr: string) => {
    const date = new Date(utcStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const localInputToUTC = (localStr: string) => {
    const date = new Date(localStr);
    return date.toISOString();
  };

  const getCurrentUTCDateTime = () => {
    return new Date().toISOString();
  };

  const validateScheduledTime = (dateStr: string) => {
    const scheduledUTC = new Date(localInputToUTC(dateStr));
    const currentUTC = new Date();

    if (scheduledUTC <= currentUTC) {
      return "Scheduled time must be in the future";
    }
    return "";
  };

  const currentDate = utcToLocalInputDateTime(getCurrentUTCDateTime());

  const [formData, setFormData] = useState<FormData>({
    title: "Test Reminder",
    description: "This is a test reminder",
    frequency: "once",
    scheduledAt: currentDate,
    message: "Test WhatsApp message",
    mediaType: "text",
    caption: "",
    file: null,
    emailSubject: "Test Email Subject",
    emailTemplate: "",
    emailBodyType: "text",
    type: "mailgun",
    emailData: {
      title: "",
      note: "",
    },
    customHTML: "This is a test email reminder",
    templateId: "",
    engagementId: engagementId ?? "",
  });

  const [channels, setChannels] = useState<Channel[]>(["whatsapp", "email"]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validations
      if (!formData.title.trim()) {
        throw new Error("Reminder title is required");
      }

      if (!formData.scheduledAt) {
        throw new Error("Schedule date and time is required");
      }

      const timeError = validateScheduledTime(formData.scheduledAt);
      if (timeError) {
        throw new Error(timeError);
      }

      // Channel-specific validations
      if (
        channels.includes("whatsapp") &&
        formData.mediaType === "text" &&
        !formData.message.trim()
      ) {
        throw new Error("WhatsApp message is required");
      }

      if (channels.includes("email") && !formData.emailSubject.trim()) {
        throw new Error("Email subject is required");
      }
      // Prepare payload
      const basePayload = {
        title: formData.title,
        description: formData.description,
        frequency: formData.frequency,
        scheduledAt: localInputToUTC(formData.scheduledAt),
        engagementId,
        category: channels.length === 2 ? "both" : channels[0],
      };

      let payload;

      // Handle file upload case
      if (formData.file) {
        const formPayload = new FormData();

        // Add base fields
        Object.entries(basePayload).forEach(([key, value]) => {
          if (value !== undefined) {
            formPayload.append(key, value as string);
          }
        });

        // Add file and media details
        formPayload.append("file", formData.file);
        formPayload.append("mediaType", formData.mediaType);

        if (formData.mediaType !== "audio") {
          formPayload.append("caption", formData.caption);
        }

        // Add WhatsApp content
        if (channels.includes("whatsapp")) {
          formPayload.append(
            "messageContent",
            JSON.stringify({
              mediaType: formData.mediaType,
              caption: formData.caption,
              mediaOptions: {
                fileName: formData.file.name,
                mimetype: formData.file.type,
              },
            })
          );
        }

        // Add email content
        if (channels.includes("email")) {
          formPayload.append(
            "emailContent",
            JSON.stringify({
              type: formData.type,
              emailSubject: formData.emailSubject,
              emailTemplate: formData.emailTemplate,
              emailBodyType: formData.emailBodyType,
              emailData: formData.emailData,
              customHTML: formData.customHTML,
              templateId: formData.templateId,
            })
          );
        }

        payload = formPayload;
      } else {
        // Handle non-file case
        payload = {
          ...basePayload,
          ...(channels.includes("whatsapp") && {
            messageContent: {
              mediaType: formData.mediaType,
              message: formData.message,
            },
            message: formData.message,
          }),
          ...(channels.includes("email") && {
            emailContent: {
              type: formData.type,
              emailSubject: formData.emailSubject,
              emailTemplate: formData.emailTemplate,
              emailBodyType: formData.emailBodyType,
              emailData: formData.emailData,
              customHTML: formData.customHTML,
              templateId: formData.templateId,
            },
          }),
        };
      }

      // Send request
      await axios.post("/api/reminder", payload, {
        headers: formData.file ? { "Content-Type": "multipart/form-data" } : {},
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to create reminder");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create reminder");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      frequency: "once",
      scheduledAt: currentDate,
      message: "",
      mediaType: "text",
      caption: "",
      file: null,
      emailSubject: "",
      emailTemplate: "",
      emailBodyType: "text",
      type: "mailgun",
      emailData: { title: "", note: "" },
      customHTML: "",
      templateId: "",
      engagementId: engagementId ?? "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
    setSuccess(false);
  };

  const toggleChannel = (channel: Channel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] lg:max-w-[1000px] p-4 md:p-6 fadeIn overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold border-b pb-4">
            Schedule Reminder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Reminder Details */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-medium text-lg">Reminder Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Reminder Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Reminder Description (Optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledAt: e.target.value,
                    }))
                  }
                  min={currentDate}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(v: Frequency) =>
                    setFormData((prev) => ({ ...prev, frequency: v }))
                  }
                >
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="border-b pb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Label htmlFor="channel" className="min-w-[100px]">
                Channels:
              </Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "whatsapp", label: "WhatsApp" },
                  { id: "email", label: "Email" },
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={channels.includes(id as "whatsapp" | "email")}
                      onCheckedChange={() =>
                        toggleChannel(id as "whatsapp" | "email")
                      }
                    />
                    <label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Section */}
          {channels.includes("whatsapp") && (
            <div className="space-y-4 animate-slideDown border-b pb-6">
              <h3 className="font-medium text-lg">WhatsApp Message</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mediaType">Message Type</Label>
                  <Select
                    value={formData.mediaType}
                    onValueChange={(v: MessageType) =>
                      setFormData((prev) => ({ ...prev, mediaType: v }))
                    }
                  >
                    <SelectTrigger id="mediaType" className="w-full">
                      <SelectValue placeholder="Message Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["text", "image", "video", "audio", "document"].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {formData.mediaType !== "text" ? (
                  <div className="space-y-4 col-span-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            file: e.target.files?.[0] || null,
                          }))
                        }
                        accept={
                          formData.mediaType === "image"
                            ? "image/*"
                            : formData.mediaType === "video"
                            ? "video/*"
                            : formData.mediaType === "audio"
                            ? "audio/*"
                            : undefined
                        }
                        className="w-full"
                      />
                      {formData.mediaType !== "audio" && (
                        <Input
                          placeholder="Caption (optional)"
                          value={formData.caption}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              caption: e.target.value,
                            }))
                          }
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full">
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Type your message..."
                      required={formData.mediaType === "text"}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Section */}
          {channels.includes("email") && (
            <div className="space-y-4 animate-slideDown">
              <h3 className="font-medium text-lg">Email Message</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <Input
                    value={formData.emailSubject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailSubject: e.target.value,
                      }))
                    }
                    placeholder="Email subject"
                    required
                    className="w-full"
                  />
                </div>

                <Select
                  value={formData.emailBodyType}
                  onValueChange={(v: "text" | "html") =>
                    setFormData((prev) => ({ ...prev, emailBodyType: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.type}
                  onValueChange={(v: "mailgun" | "gmail") =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Email Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.emailBodyType === "html" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Email Title"
                    value={formData.emailData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailData: { ...prev.emailData, title: e.target.value },
                      }))
                    }
                    className="w-full"
                  />
                  <Input
                    placeholder="Template ID (Optional)"
                    value={formData.templateId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        templateId: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                  <div className="col-span-full">
                    <Textarea
                      placeholder="Email Note"
                      value={formData.emailData.note}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emailData: {
                            ...prev.emailData,
                            note: e.target.value,
                          },
                        }))
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              <Textarea
                value={formData.customHTML}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customHTML: e.target.value,
                  }))
                }
                placeholder={`Enter ${
                  formData.emailBodyType === "html"
                    ? "HTML template"
                    : "email content"
                }...`}
                required
                className="min-h-[150px]"
              />
            </div>
          )}

          {error && (
            <Alert variant="error" className="mt-4" description={error} />
          )}
          {success && (
            <Alert
              className="bg-green-50 text-green-700 border-green-200 mt-4"
              description="Reminder scheduled successfully!"
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
              disabled={isLoading || channels.length === 0}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scheduling...</span>
                </div>
              ) : (
                "Schedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EngagementPopup;
