import { useState } from "react";
import Input from "@/components/ui/input";
import { Label } from "@/components/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";


interface EmailConfigProps {
  hasAttachment: boolean;
  attachmentFile: File | null;
  formData: {
    emailSubject: string;
    customHTML: string;
    emailTitle?: string;
    emailNote?: string;
    templateId?: string;
  };
  setFormData: (data: unknown) => void;
}

const EmailConfig = ({
  formData,
  setFormData,
}: EmailConfigProps) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [emailService, setEmailService] = useState<"mailgun" | "gmail">(
    "mailgun"
  );

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* Header with Icon */}
        <div className="flex items-center space-x-2 text-primary">
          <Mail className="w-5 h-5" />
          <h3 className="font-medium">Email Configuration</h3>
        </div>

        {/* Email Service Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email Service</Label>
            <Select
              value={emailService}
              onValueChange={(value: "mailgun" | "gmail") =>
                setEmailService(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mailgun">Mailgun</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* HTML/Text Toggle */}
          <div className="space-y-2">
            <Label>Email Format</Label>
            <div className="flex items-center justify-between p-2 rounded-md border">
              <span className="text-sm text-gray-600">Use HTML Format</span>
              <Switch
                checked={isHtmlMode}
                onCheckedChange={setIsHtmlMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Subject Line */}
        <div className="space-y-2">
          <Label htmlFor="email-subject">Subject</Label>
          <Input
            id="email-subject"
            placeholder="Enter email subject"
            value={formData.emailSubject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, emailSubject: e.target.value })
            }
          />
        </div>

        {/* HTML Mode Fields */}
        {isHtmlMode && (
          <div className="space-y-4 animate-slideDown">
            <div className="space-y-2">
              <Label htmlFor="email-title">Email Title</Label>
              <Input
                id="email-title"
                placeholder="Email title"
                value={formData.emailTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, emailTitle: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-note">Email Note</Label>
              <Textarea
                id="email-note"
                placeholder="Add a note"
                value={formData.emailNote}
                onChange={(e) =>
                  setFormData({ ...formData, emailNote: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-id">Template ID (Optional)</Label>
              <Input
                id="template-id"
                placeholder="Enter template ID"
                value={formData.templateId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, templateId: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-2">
          <Label htmlFor="email-content">
            {isHtmlMode ? "HTML Content" : "Email Content"}
          </Label>
          <Textarea
            id="email-content"
            placeholder={`Enter ${isHtmlMode ? "HTML" : "email"} content...`}
            value={formData.customHTML}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>{
            console.log(e.target.value)
              setFormData({
                ...formData,
                customHTML: e.target.value,
              })
            }}
            rows={6}
            className="font-mono"
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default EmailConfig;
