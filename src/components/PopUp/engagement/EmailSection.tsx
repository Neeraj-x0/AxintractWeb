import Input  from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORMData, EmailBodyType, EmailServiceType } from "./types";

interface EmailSectionProps {
  formData: FORMData;
  setFormData: (data: FORMData) => void;
}

export const EmailSection = ({ formData, setFormData }: EmailSectionProps) => {
  return (
    <div className="space-y-4 animate-slideDown">
    <h3 className="font-medium">Email Message</h3>
    <Input
      value={formData.emailSubject}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setFormData({
        ...formData,
        emailSubject: e.target.value,
        })
      }
      placeholder="Email subject"
      required
    />

      <div className="grid grid-cols-2 gap-4">
        <Select
          value={formData.emailBodyType}
          onValueChange={(v: EmailBodyType) =>
            setFormData({ ...formData, emailBodyType: v })
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
          onValueChange={(v: EmailServiceType) =>
            setFormData({ ...formData, type: v })
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
            onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                emailData: { ...formData.emailData, title: e.target.value },
              })
            }
          />
          <Textarea
            placeholder="Email Note"
            value={formData.emailData.note}
            onChange={(e) =>
              setFormData({
                ...formData,
                emailData: { ...formData.emailData, note: e.target.value },
              })
            }
          />
          <Input
            placeholder="Template ID (Optional)"
            value={formData.templateId}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                templateId: e.target.value,
              })
            }
          />
        </div>
      )}

      <Textarea
        value={formData.customHTML}
        onChange={(e) =>
          setFormData({
            ...formData,
            customHTML: e.target.value,
          })
        }
        placeholder={`Enter ${
          formData.emailBodyType === "html" ? "HTML template" : "email content"
        }...`}
        required
      />
    </div>
  );
};