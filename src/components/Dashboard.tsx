"use client";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/redux/store";
import Analytics from "../app/Dashboard";
import LeadsManagement from "../app/lead/page";
import RemindersDashboard from "@/app/reminders/page";
import CampaignDashboard from "@/app/campaigns/page";
import FollowUpCampaign from "@/app/followup/page";
import ChatbotAnalytics from "@/app/chatbot";
import Settings from "@/app/settings/page";
import Engagements from "@/app/engagements/page";

const Dashboard: React.FC = () => {
  const activeItem = useSelector(
    (state: RootState) => state.sidebar.activeItem
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when switching views
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeItem]);

  // Component map for better organization
  const components = {
    Dashboard: Analytics,
    Leads: LeadsManagement,
    Reminders: RemindersDashboard,
    Campaigns: CampaignDashboard,
    "Follow Ups": FollowUpCampaign,
    "Chat Bot": ChatbotAnalytics,
    Settings: Settings,
    Engagements: Engagements,
  } as const;

  // Get the current component
  const CurrentComponent = components[activeItem as keyof typeof components];

  return (
    <div className="relative h-full flex flex-col">
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="">
          {CurrentComponent ? (
            <div className="animate-fadeIn">
              <CurrentComponent />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No content available for {activeItem}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
