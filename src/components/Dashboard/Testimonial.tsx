"use client";
import { Award } from "lucide-react";

const Testimonial = () => {
  return (
    <div className="bg-blue-700 rounded-lg p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 transform skew-x-12 translate-x-1/3 z-0 hidden sm:block"></div>
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Award className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-lg sm:text-xl font-bold">Why Fast Response Matters</h3>
        </div>
        <p className="text-blue-100 mb-4 max-w-xl text-sm sm:text-base">
          &quot;Studies show that leads engaged within 5 minutes are 21x more likely
          to convert. Leads Engager helped us reduce our average response time from
          hours to just 3 minutes.&quot;
        </p>
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-blue-800 font-bold text-sm sm:text-base">
            JT
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">Jason Taylor</p>
            <p className="text-blue-200 text-xs sm:text-sm">
              Marketing Director, TechStart Inc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
