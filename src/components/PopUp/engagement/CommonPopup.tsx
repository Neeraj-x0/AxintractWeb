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
  defaultSubject?: string;
}

type MessageType = "text" | "image" | "video" | "audio" | "document";

const EngagementPopup = ({ isOpen, onClose, engagementId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // WhatsApp fields
    message: "",
    mediaType: "text" as MessageType,
    caption: "",
    file: null as File | null,

    // Email fields
    emailSubject: "",
    emailTemplate: "",
    emailBodyType: "text" as "text" | "html",
    type: "mailgun" as "mailgun" | "gmail",
    emailData: {
      title: "",
      note: "",
    },
    customHTML: "",
    templateId: "",
  });
  const [channels, setChannels] = useState<("whatsapp" | "email")[]>([
    "whatsapp",
    "email",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(channels);
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      const payload: {
        channels: ("whatsapp" | "email")[];
        message?: string;
        type?: MessageType;
        mediaType?: MessageType;
        mediaOptions?: {
          caption?: string;
          fileName?: string;
          mimetype?: string;
        };
        emailSubject?: string;
        emailTemplate?: string;
        emailBodyType?: "text" | "html";
        emailData?: { title: string; note: string };
        customHTML?: string;
        templateId?: string;
      } = { channels };

      payload.channels = channels;
      if (formData.file) {
        data.append("file", formData.file);
        data.append("fileName", formData.file.name);
        data.append("mime", formData.file.type);
        data.append("channels", channels.join(","));
        data.append("mediaType", formData.mediaType);
        data.append("type", formData.type);
        if (channels.includes("email")) {
          data.append("emailSubject", formData.emailSubject);
          data.append("emailTemplate", formData.emailTemplate);
          data.append("emailBodyType", formData.emailBodyType);
          data.append("emailData", JSON.stringify(formData.emailData));
          data.append("customHTML", formData.customHTML);
          data.append("templateId", formData.templateId);
        }

        if (formData.mediaType !== "audio") {
          data.append("caption", formData.caption || "");
        }
      }

      if (channels.includes("whatsapp")) {
        if (formData.mediaType === "text") {
          payload.message = formData.message;
        } else if (formData.file) {
          payload.mediaOptions = {
            caption: formData.caption,
            fileName: formData.file.name,
            mimetype: formData.file.type,
          };
        }
      }

      if (channels.includes("email")) {
        payload.emailSubject = formData.emailSubject;
        payload.emailTemplate = formData.emailTemplate;
        payload.emailBodyType = formData.emailBodyType;
        payload.emailData = formData.emailData;
        payload.customHTML = formData.customHTML;
        payload.templateId = formData.templateId;
      }

      await axios.post(
        `/api/engagements/${engagementId}/send`,
        formData.file ? data : payload,
        {
          headers: {
            ...(formData.file && { "Content-Type": "multipart/form-data" }),
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to send message");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetForm = () => {
    setFormData({
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
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleChannel = (channel: "whatsapp" | "email") => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-6 fadeIn">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-xl">
            <span>Send Message</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Selection */}
          <div className="flex gap-4 items-center border-b pb-4">
            <Label htmlFor="channel">Channels:</Label>
            <div className="flex gap-4">
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
                  <label htmlFor={id}>{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Section */}
          {channels.includes("whatsapp") && (
            <div className="space-y-4 animate-slideDown border-b pb-4">
              <h3 className="font-medium">WhatsApp Message</h3>
              <Select
                value={formData.mediaType}
                onValueChange={(v: MessageType) =>
                  setFormData((prev) => ({ ...prev, mediaType: v }))
                }
              >
                <SelectTrigger>
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

              {formData.mediaType !== "text" && (
                <>
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
                    />
                  )}
                </>
              )}
              {formData.mediaType === "text" && (
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
                />
              )}
            </div>
          )}

          {/* Email Section */}
          {channels.includes("email") && (
            <div className="space-y-4 animate-slideDown">
              <h3 className="font-medium">Email Message</h3>
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
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={formData.emailBodyType}
                  onValueChange={(v: "text" | "html") =>
                    setFormData((prev) => ({ ...prev, emailBodyType: v }))
                  }
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Email Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.emailBodyType === "html" && (
                <div className="space-y-4 animate-slideDown">
                  <Input
                    placeholder="Email Title"
                    value={formData.emailData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailData: { ...prev.emailData, title: e.target.value },
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Email Note"
                    value={formData.emailData.note}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailData: { ...prev.emailData, note: e.target.value },
                      }))
                    }
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
                  />
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
              />
            </div>
          )}

          {error && <Alert variant="error" description={error} />}
          {success && (
            <Alert
              className="bg-green-50 text-green-700 border-green-200"
              description="Message sent successfully!"
            />
          )}

          <div className="flex justify-end gap-3">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading || channels.length === 0}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Messages"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EngagementPopup;
