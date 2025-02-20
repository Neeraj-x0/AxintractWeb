"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MessageCircle,
  Users,
  Clock,
  TrendingUp,
  Brain,
  Globe,
  Smartphone,
  Download,
} from "lucide-react";
import { Overlay } from "@/components/overlay";

const ChatbotAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const interactionData = [
    { day: "Mon", interactions: 2400, success: 2000, fallback: 400 },
    { day: "Tue", interactions: 2800, success: 2300, fallback: 500 },
    { day: "Wed", interactions: 3200, success: 2800, fallback: 400 },
    { day: "Thu", interactions: 2900, success: 2500, fallback: 400 },
    { day: "Fri", interactions: 3100, success: 2700, fallback: 400 },
    { day: "Sat", interactions: 2300, success: 2000, fallback: 300 },
    { day: "Sun", interactions: 2100, success: 1800, fallback: 300 },
  ];

  const sentimentData = [
    { name: "Positive", value: 65, color: "#22c55e" },
    { name: "Neutral", value: 25, color: "#64748b" },
    { name: "Negative", value: 10, color: "#ef4444" },
  ];

  const keyMetrics = [
    {
      label: "Total Interactions",
      value: "32,847",
      change: "+12%",
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: "8,492",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Avg Response Time",
      value: "1.2s",
      change: "-15%",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      label: "Conversion Rate",
      value: "24%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ];


    return (
      <div className="relative w-full h-full">
        {/* Content (blurred background) */}
        <div className="filter blur-sm opacity-50">
          <ChatbotAnalyticsContent
            interactionData={interactionData}
            sentimentData={sentimentData}
            keyMetrics={keyMetrics}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>
        <Overlay />
      </div>
    );
  }


interface ChatbotAnalyticsContentProps {
  interactionData: {
    day: string;
    interactions: number;
    success: number;
    fallback: number;
  }[];
  sentimentData: {
    name: string;
    value: number;
    color: string;
  }[];
  keyMetrics: {
    label: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
  }[];
  timeRange: string;
  setTimeRange: React.Dispatch<React.SetStateAction<string>>;
}

// Separate the content into its own component
const ChatbotAnalyticsContent: React.FC<ChatbotAnalyticsContentProps> = ({
  interactionData,
  sentimentData,
  keyMetrics,
  timeRange,
  setTimeRange,
}) => {
  return (
    <div className="p-6 space-y-6 fadeIn overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chatbot Analytics
          </h1>
          <p className="text-gray-500">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <select
            className="px-3 py-1 text-gray-600 outline outline-1 outline-gray-600 rounded-s"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6 mt-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2 text-sm font-medium">
                <span
                  className={
                    metric.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {metric.change}
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interaction Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Interaction Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ color: "#1F2937" }} />
                <Line
                  type="monotone"
                  dataKey="interactions"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="success"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="fallback"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              User Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "North America", value: "42%", trend: "+5%" },
                { region: "Europe", value: "28%", trend: "+3%" },
                { region: "Asia", value: "20%", trend: "+8%" },
                { region: "Others", value: "10%", trend: "+2%" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{item.region}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}
                    </span>
                    <span className="text-xs text-green-600">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-green-600" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { platform: "Web", users: 4500 },
                    { platform: "Mobile", users: 3800 },
                    { platform: "WhatsApp", users: 2200 },
                    { platform: "Messenger", users: 1500 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotAnalytics;
