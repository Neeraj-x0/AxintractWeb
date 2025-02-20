"use client";
import { Clock, MessageSquare, TrendingUp } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "Instant Response",
      description:
        "Automatically engage new leads within seconds of receiving them, before your competitors can.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "AI-Powered Conversations",
      description:
        "Let our AI handle initial responses and qualifications while maintaining a personal touch.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Analytics & Insights",
      description:
        "Track performance metrics and optimize your approach based on what works best.",
    },
  ];

  return (
    <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Why Choose Leads Engager?
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-4">
        Our platform helps you engage leads faster and more effectively, increasing
        your conversion rates and growing your business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
              {benefit.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;