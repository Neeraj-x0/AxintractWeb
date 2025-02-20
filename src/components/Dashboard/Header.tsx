"use client";
import { CheckCircle } from "lucide-react";

interface HeaderProps {
  successPoints: string[];
}

const Header = ({ successPoints }: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-16 px-4 sm:px-8">
      <div className="mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to Leads Engager
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8 opacity-90">
          Respond faster, convert more leads. Don&apos;t lose to competitors due to
          slow response times.
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-8 mt-8 sm:mt-12">
          {successPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-2 max-w-xs">
              <CheckCircle className="text-blue-300 mt-1 flex-shrink-0" size={20} />
              <p className="text-blue-100 text-sm sm:text-base">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;