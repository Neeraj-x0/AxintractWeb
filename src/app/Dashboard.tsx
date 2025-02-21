"use client";
import React, { useState, useEffect, useMemo } from "react";
import useAxios from "@/lib";
import Header from "@/components/Dashboard/Header";
import QuickActions from "@/components/Dashboard/QuickActions";
import EngagementChart from "@/components/Dashboard/EngagementChart";
import PendingLeads from "@/components/Dashboard/PendingLeads";
import EngagementStats from "@/components/Dashboard/EngagementStats";
import Reminders from "@/components/Dashboard/Reminders";
import TemplateCard from "@/components/Dashboard/TemplateCard";
import Benefits from "@/components/Dashboard/Benefits";

const LeadsEngagerDashboard = () => {
  const [engagementData, setEngagementData] = useState([
    { day: "Mon", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Tue", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Wed", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Thu", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Fri", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Sat", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
    { day: "Sun", "New Leads": 0, Engaged: 0, Converted: 0, rate: 0 },
  ]);
  const [metrics, setMetrics] = useState({
    responseRate: { value: 0, change: "0%" },
    avgResponseTime: { value: 0, change: "0%" },
    conversionRate: { value: 0, change: "0%" },  
  });

  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/analytics/dashboard");
        if (response.status === 200) {
          setEngagementData(response.data.weekly);
          setMetrics(response.data.metrics);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [axios]);

  const pendingLeads = useMemo(
    () => [
      {
        name: "Sarah Johnson",
        time: "5 min",
        source: "WhatsApp",
        urgent: true,
      },
      {
        name: "Michael Chen",
        time: "20 min",
        source: "Email",
        urgent: true,
      },
      {
        name: "Priya Sharma",
        time: "1 hour",
        source: "Form",
        urgent: false,
      },
    ],
    []
  );

  const reminders = useMemo(
    () => [
      "Send proposal templates to 15 new leads",
      "Follow up with premium category leads",
      "Schedule demo call with interested leads",
    ],
    []
  );

  const successPoints = useMemo(
    () => [
      "Reduce response time from hours to minutes",
      "Increase lead conversion by up to 35%",
      "Personalize communication at scale with AI",
      "Stay ahead of competitors with timely follow-ups",
    ],
    []
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header successPoints={successPoints} />

      <div className="p-4 sm:p-8 mx-auto -mt-8 sm:-mt-10">
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <EngagementChart data={engagementData} />
            <PendingLeads leads={pendingLeads} />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <EngagementStats metrics={metrics} />
            <Reminders reminders={reminders} />
            <TemplateCard />
          </div>
        </div>
        <Benefits />
      </div>
    </div>
  );
};

export default LeadsEngagerDashboard;
