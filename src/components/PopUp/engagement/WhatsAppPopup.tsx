import React, { useState, useRef } from "react";
import { X } from "lucide-react";
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
import useAxios from "@/lib";
import { AxiosError } from "axios";

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  engagementId?: string;
}

type MessageType = "text" | "image" | "video" | "audio" | "document";

interface FormData {
  message: string;
  mediaType: MessageType | "";
  caption?: string;

  file?: File | null;
}

const WhatsAppPopup = ({
  isOpen,
  onClose,
  engagementId,
}: WhatsAppPopupProps) => {
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    message: "",
    mediaType: "text",
    caption: "",
    file: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      if (formData.mediaType !== "text") {
        if (!formData.file) {
          throw new Error("Please select a file to upload");
        }
        console.log(formData.file);
        data.append("file", formData.file);
        data.append("fileName", formData.file.name);
        data.append("mime", formData.file.type);

        if (formData.caption) {
          data.append("caption", formData.caption);
        }
        data.append("mediaType", formData.mediaType);
        const response = await axios.post(
          `/api/whatsapp/${formData.mediaType}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "engagement-id": engagementId,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to send media message");
        }
      } else {
        const response = await axios.post(
          "/api/whatsapp/text",
          {
            message: formData.message,
          },
          {
            headers: {
              "engagement-id": engagementId,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to send text message");
        }
      }

      setSuccess(true);
      resetForm();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
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

  const resetForm = () => {
    setFormData({
      message: "",
      mediaType: "text",
      caption: "",
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] fadeIn p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center justify-between text-xl">
            <span>Send WhatsApp Message</span>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="messageType" className="text-sm font-medium">
              Message Type
            </Label>
            <Select
              value={formData.mediaType}
              onValueChange={(value: MessageType | "") =>
                setFormData((prev) => ({ ...prev, mediaType: value }))
              }
            >
              <SelectTrigger className="w-full h-10 bg-white">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border">
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.mediaType && formData.mediaType != "text" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">
                  Upload {formData.mediaType}
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
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
                    required
                  />
                </div>
              </div>

              {formData.mediaType !== "audio" && (
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-sm font-medium">
                    Caption (Optional)
                  </Label>
                  <Input
                    id="caption"
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        caption: e.target.value,
                      }))
                    }
                    placeholder="Enter caption"
                    className="w-full h-10"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Type your message..."
                className="min-h-[150px]"
                required
              />
            </div>
          )}

          {error && (
            <Alert variant="error" description={error} className="mt-4" />
          )}

          {success && (
            <Alert
              className="bg-green-50 text-green-700 border-green-200 mt-4"
              description="Message sent successfully!"
            />
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppPopup;
