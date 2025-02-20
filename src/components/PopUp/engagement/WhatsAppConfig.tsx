import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface WhatsAppFormData {
  message: string;
  caption: string;
  attachmentFile: File | null;
  generatePoster?: boolean;
}

interface WhatsAppSectionProps {
  formData: WhatsAppFormData;
  setFormData: (data: WhatsAppFormData) => void;
  className?: string;
}

const WhatsAppSection = ({
  formData,
  setFormData,
  className,
}: WhatsAppSectionProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium text-gray-900">WhatsApp Message</h3>

      {formData.attachmentFile || formData.generatePoster ? (
        <Textarea
          value={formData.caption}
          onChange={(e) =>
            setFormData({ ...formData, caption: e.target.value })
          }
          placeholder="Add a caption..."
          className="min-h-[100px] resize-none"
        />
      ) : (
        <Textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Type your WhatsApp message..."
          className="min-h-[150px] resize-none"
          required
        />
      )}
    </div>
  );
};

export default WhatsAppSection;
