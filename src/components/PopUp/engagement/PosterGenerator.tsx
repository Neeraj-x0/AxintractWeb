import React, { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";
import Image from "next/image";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PosterGeneratorProps {
  onPosterGenerated: (
    icon: File,
    background: File,
    note: string,
    title: string
  ) => void;
  onClose: () => void;
}

const PosterGenerator = ({
  onPosterGenerated,
  onClose,
}: PosterGeneratorProps) => {
  const [title, setTitle] = useState("Your Title Here");
  const [note, setNote] = useState("Your message here");
  const [icon, setIcon] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleCharLimit = 75;
  const noteCharLimit = 255;

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIcon(e.target.files[0]);
      setError(null);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBackground(e.target.files[0]);
      setError(null);
    }
  };

  const generatePoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icon) {
      setError("Please upload an icon");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Instead of making an API call, directly pass the data to the parent
      onPosterGenerated(icon, background as File, note, title);

      // Create a preview URL for the icon
      const previewUrl = URL.createObjectURL(icon);
      setPreviewUrl(previewUrl);
    } catch {
      setError("Failed to process poster data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value.substring(0, titleCharLimit))
            }
            placeholder="Enter poster title"
            maxLength={titleCharLimit}
          />
          <span className="text-xs text-gray-500">
            {title.length}/{titleCharLimit}
          </span>
        </div>

        <div>
          <Textarea
            value={note}
            onChange={(e) =>
              setNote(e.target.value.substring(0, noteCharLimit))
            }
            placeholder="Enter poster message"
            maxLength={noteCharLimit}
          />
          <span className="text-xs text-gray-500">
            {note.length}/{noteCharLimit}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Background (Optional)</label>
            <div className="border-2 border-dashed border-gray-800 rounded p-4 text-center">
              <input
                type="file"
                onChange={handleBackgroundUpload}
                accept="image/*"
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiImage className="h-6 w-6 mb-2" />
                <span className="text-sm">
                  {background ? background.name : "Upload Background"}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Icon (Required)</label>
            <div className="border-2 border-dashed rounded p-4 text-center">
              <input
                type="file"
                onChange={handleIconUpload}
                accept="image/png"
                className="hidden"
                id="icon-upload"
                required
              />
              <label
                htmlFor="icon-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiImage className="h-6 w-6 mb-2" />
                <span className="text-sm">
                  {icon ? icon.name : "Upload Icon"}
                </span>
              </label>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={generatePoster} disabled={isGenerating}>
            {isGenerating ? "Adding..." : "Add Poster"}
          </Button>
        </div>
      </form>

      {previewUrl && (
        <div className="mt-4">
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={previewUrl}
              alt="Generated Poster"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterGenerator;
