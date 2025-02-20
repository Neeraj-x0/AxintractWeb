"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const TemplateCard = () => {
  return (
    <Card className="bg-blue-50 border border-blue-100 shadow-lg overflow-hidden">
      <div className="absolute w-12 sm:w-16 h-12 sm:h-16 bg-blue-200 rounded-full -top-8 -right-8"></div>
      <div className="absolute w-6 sm:w-8 h-6 sm:h-8 bg-blue-200 rounded-full bottom-12 left-4"></div>
      <CardContent className="pt-4 sm:pt-6 relative z-10">
        <div className="text-center p-3 sm:p-4">
          <FileText size={36} className="text-blue-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="font-semibold text-blue-800 mb-2 text-base sm:text-lg">
            New to Leads Engager?
          </h3>
          <p className="text-blue-700 text-xs sm:text-sm mb-3 sm:mb-4">
            Download our sample Excel template to get started quickly.
          </p>
          <button className="w-full py-2 bg-white border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center text-sm">
            Download Template
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;