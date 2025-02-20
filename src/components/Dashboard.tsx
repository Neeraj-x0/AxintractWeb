// Dashboard.tsx
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
  const activeItem = useSelector((state: RootState) => state.sidebar.activeItem);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when switching views
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeItem]);

  return (
    <main className="relative flex-1 h-full overflow-hidden">
      {/* Wrap content in a container that manages overflow */}
      <div 
        ref={contentRef}
        className="absolute inset-0 overflow-y-auto"
      >
        <div className="min-h-full w-full">
          {activeItem === "Dashboard" && <Analytics />}
          {activeItem === "Leads" && <LeadsManagement />}
          {activeItem === "Reminders" && <RemindersDashboard />}
          {activeItem === "Campaigns" && <CampaignDashboard />}
          {activeItem === "Follow Ups" && <FollowUpCampaign />}
          {activeItem === "Chat Bot" && <ChatbotAnalytics />}
          {activeItem === "Settings" && <Settings />}
          {activeItem === "Engagements" && <Engagements />}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;