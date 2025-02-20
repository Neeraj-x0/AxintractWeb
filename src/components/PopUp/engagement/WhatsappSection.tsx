import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Input  from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PosterGenerator from "./PosterGenerator";
import { MessageType, FORMData } from "./types";

interface WhatsAppSectionProps {
  formData: FORMData;
  setFormData: (data: FORMData) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const WhatsAppSection = ({
  formData,
  setFormData,
  fileInputRef,
}: WhatsAppSectionProps) => {
  const [showPosterGenerator, setShowPosterGenerator] = useState(false);

  const handlePosterGenerated = (posterFile: File) => {
    setFormData({
      ...formData,
      mediaType: "image",
      file: posterFile,
      caption: formData.message || "Generated Poster",
    });
    setShowPosterGenerator(false);
  };

  return (
    <div className="space-y-4 animate-slideDown border-b pb-4">
      <h3 className="font-medium">WhatsApp Message</h3>
      <div className="flex items-center gap-4">
        <Select
          value={formData.mediaType}
          onValueChange={(v: MessageType) =>
            setFormData({ ...formData, mediaType: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Message Type" />
          </SelectTrigger>
          <SelectContent>
            {["text", "image", "video", "audio", "document"].map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Generate Poster button */}
        {formData.mediaType === "image" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPosterGenerator(true)}
          >
            Generate Poster
          </Button>
        )}
      </div>

      {formData.mediaType !== "text" ? (
        <>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              setFormData({
                ...formData,
                file: e.target.files?.[0] || null,
              })
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
                setFormData({
                  ...formData,
                  caption: e.target.value,
                })
              }
            />
          )}
        </>
      ) : (
        <Textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({
              ...formData,
              message: e.target.value,
            })
          }
          placeholder="Type your message..."
          required
        />
      )}

      {/* Poster Generator Dialog */}
      <Dialog open={showPosterGenerator} onOpenChange={setShowPosterGenerator}>
        <DialogContent className="sm:max-w-[700px]">
          <PosterGenerator
            onPosterGenerated={handlePosterGenerated}
            onClose={() => setShowPosterGenerator(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};