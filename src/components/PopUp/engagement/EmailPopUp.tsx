import React, { useState } from "react";
import { X, Info } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib";
import { AxiosError } from "axios";

interface engagementEmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  engagementId?: string;
  defaultTo?: string;
  defaultSubject?: string;
}

const EngagementEmailPopup: React.FC<engagementEmailPopupProps> = ({
  isOpen,
  onClose,
  engagementId,
  defaultSubject = "",
}: engagementEmailPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: defaultSubject,
    bodyType: "text", // Default to plain text
    customHTML: "",
    templateId: "",
    engagementId: "",
    type: "mailgun",
    data: {
      title: "",
      note: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "/api/email",
        {
          ...formData,
        },
        {
          headers: {
            "engagement-id": engagementId,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to send email");
      }
      setSuccess(true);
      setFormData({
        subject: "",
        bodyType: "text",
        customHTML: "",
        templateId: "",
        type: "mailgun",
        engagementId: "",
        data: {
          title: "",
          note: "",
        },
      });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to send email");
      } else {
        setError("Failed to send email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === "title" || field === "note") {
      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] fadeIn p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center justify-between text-xl">
            <span>Send Email</span>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Email subject"
                className="w-full h-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {formData.bodyType === "html" && (
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.data.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter title"
                  className="w-full h-10"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Email Service
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="w-full h-10 bg-white">
                  <SelectValue placeholder="Select email service" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border">
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.bodyType === "html" && (
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Note
              </Label>
              <Textarea
                id="note"
                value={formData.data.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Enter note"
                className="min-h-[80px] resize-none"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bodyType" className="text-sm font-medium">
                Body Type
              </Label>
              <Select
                value={formData.bodyType}
                onValueChange={(value) => handleChange("bodyType", value)}
              >
                <SelectTrigger className="w-full h-10 bg-white">
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border">
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateId" className="text-sm font-medium">
                Template ID (Optional)
              </Label>
              <Input
                id="templateId"
                value={formData.templateId}
                onChange={(e) => handleChange("templateId", e.target.value)}
                placeholder="Enter template ID"
                className="w-full h-10"
              />
            </div>
          </div>
          {formData.bodyType === "text" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Email Content
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-3 shadow-lg border rounded-lg">
                      <p className="text-sm text-gray-600">
                        Available placeholders:
                        <br />
                        {"{"}
                        {"{"} name {"}"}
                        {"}"} - Recipient&apos;s name
                        <br />
                        {"{"}
                        {"{"} title {"}"}
                        {"}"} - Email title
                        <br />
                        {"{"}
                        {"{"} note {"}"}
                        {"}"} - Note content
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Textarea
                id="content"
                value={formData.customHTML}
                onChange={(e) => handleChange("customHTML", e.target.value)}
                placeholder="Enter your email content... Use {{name}}, {{title}}, {{note}} as placeholders"
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
              description="Email sent successfully!"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                "Send Email"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EngagementEmailPopup;
