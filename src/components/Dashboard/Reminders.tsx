"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellRing, Send } from "lucide-react";

interface RemindersProps {
  reminders: string[];
}

const Reminders = ({ reminders }: RemindersProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <BellRing size={18} className="mr-2 text-blue-600" /> Today&apos;s
          Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 bg-white">
        <div className="space-y-3 sm:space-y-4">
          {reminders.map((reminder, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <p className="text-gray-800 text-sm sm:text-base">{reminder}</p>
              </div>
            </div>
          ))}
          <button className="w-full py-2 sm:py-3 mt-4 sm:mt-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base">
            <Send size={16} className="mr-2" /> Send Campaign Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reminders;