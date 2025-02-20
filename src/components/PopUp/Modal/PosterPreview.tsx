import React from "react";
import Image from "next/image";

import { Label } from "@/components/label";
import { PosterData } from "./types";
import { Card } from "@/components/ui/card";
import { MotionDiv } from "@/components/MotionComponents";

interface PosterPreviewProps {
  poster: PosterData;
  className?: string;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  poster,
  className = "",
}) => {
  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h4 className="text-lg font-medium mb-4">Poster Preview</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={URL.createObjectURL(poster.icon)}
                alt="Icon Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background</Label>
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={URL.createObjectURL(poster.background)}
                alt="Background Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-900 font-medium break-words">
                {poster.title}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <div className="p-3 bg-gray-50 rounded-lg min-h-[100px]">
              <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {poster.note}
              </p>
            </div>
          </div>

          <MotionDiv
            className="hidden sm:block mt-4 p-3 bg-blue-50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-blue-600">
              Your poster will be generated with these details. The final result
              may vary slightly to ensure optimal visual quality.
            </p>
          </MotionDiv>
        </MotionDiv>
      </div>
    </Card>
  );
};

// Optional: Add a loading state component
export const PosterPreviewSkeleton: React.FC = () => {
  return (
    <Card className="p-6 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="w-full h-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
};