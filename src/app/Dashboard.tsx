/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useMemo, memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  MessageSquare,
  Upload,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  ChevronRight,
  AlertCircle,
  ChevronsRight,
  BellRing,
  FileText,
  Send,
  CheckCircle,
  Award,
} from "lucide-react";
import { Overlay } from "@/components/overlay";

// Memoized components for better performance
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  step: number;
}
const QuickActionButton = memo(
  ({ icon, label, description, step }: QuickActionButtonProps) => (
    <button className="flex flex-col items-start p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group h-full shadow-md hover:shadow-lg">
      <div className="flex items-center mb-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-200">
          {icon}
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          Step {step}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2 text-lg group-hover:text-blue-700">
        {label}
      </h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  )
);

interface EngagementStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const EngagementStat = memo(
  ({ label, value, icon, change }: EngagementStatProps) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
    </div>
  )
);

interface PendingLeadProps {
  lead: {
    name: string;
    time: string;
    source: string;
    urgent: boolean;
  };
}

const PendingLead = memo(({ lead }: PendingLeadProps) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        {lead.source === "WhatsApp" ? (
          <Phone size={16} />
        ) : lead.source === "Email" ? (
          <Mail size={16} />
        ) : (
          <FileText size={16} />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{lead.name}</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">Received {lead.time} ago</p>
          {lead.urgent && (
            <span className="flex items-center text-amber-600 text-sm">
              <AlertCircle size={12} className="mr-1" /> Needs response
            </span>
          )}
        </div>
      </div>
    </div>
    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
      Engage <ChevronRight size={16} className="ml-1" />
    </button>
  </div>
));

const LeadsEngagerDashboard = () => {
  // Enhanced sample data
  const engagementData = useMemo(
    () => [
      {
        day: "Mon",
        "New Leads": 32,
        Engaged: 18,
        Converted: 5,
        rate: 15.6,
      },
      {
        day: "Tue",
        "New Leads": 28,
        Engaged: 20,
        Converted: 7,
        rate: 25.0,
      },
      {
        day: "Wed",
        "New Leads": 35,
        Engaged: 25,
        Converted: 9,
        rate: 25.7,
      },
      {
        day: "Thu",
        "New Leads": 40,
        Engaged: 30,
        Converted: 12,
        rate: 30.0,
      },
      {
        day: "Fri",
        "New Leads": 38,
        Engaged: 28,
        Converted: 10,
        rate: 26.3,
      },
      {
        day: "Sat",
        "New Leads": 25,
        Engaged: 15,
        Converted: 6,
        rate: 24.0,
      },
      {
        day: "Sun",
        "New Leads": 22,
        Engaged: 12,
        Converted: 4,
        rate: 18.2,
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        icon: <Upload size={20} />,
        label: "Import Leads",
        description:
          "Upload Excel/CSV files or manually add leads with name, phone, email, and notes.",
        step: 1,
      },
      {
        icon: <Users size={20} />,
        label: "Manage Leads",
        description:
          "Categorize and set lead status to organize your engagement strategy.",
        step: 2,
      },
      {
        icon: <MessageSquare size={20} />,
        label: "Engage & Convert",
        description:
          "Send personalized messages via WhatsApp and email using AI assistance.",
        step: 3,
      },
    ],
    []
  );

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
  <> 
    <Overlay/>  

    {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 transition-opacity">
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-8">
        <div className="mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Leads Engager</h1>
          <p className="text-xl max-w-2xl mb-8 opacity-90">
            Respond faster, convert more leads. Don&apos;t lose to competitors
            due to slow response times.
          </p>
          <div className="flex flex-wrap gap-8 mt-12">
            {successPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-2 max-w-xs">
                <CheckCircle
                  className="text-blue-300 mt-1 flex-shrink-0"
                  size={20}
                />
                <p className="text-blue-100">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 mx-auto -mt-10">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <QuickActionButton key={index} {...step} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
          <div className="lg:col-span-2 space-y-8">
         
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b">
                <CardTitle className="text-base font-semibold flex items-center">
                  <TrendingUp size={18} className="mr-2 text-blue-600" />
                  This Week&apos;s Leads Engagement
                </CardTitle>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                  View Detailed Report{" "}
                  <ChevronsRight size={16} className="ml-1" />
                </button>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementData}>
                      <defs>
                        <linearGradient
                          id="newLeadsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1E40AF"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1E40AF"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="engagedLeadsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06B6D4"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06B6D4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          color: "#1F2937",
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="New Leads"
                        stroke="#1E40AF"
                        strokeWidth={2}
                        fill="url(#newLeadsGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Engaged"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        fill="url(#engagedLeadsGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            
            <div className="bg-blue-700 rounded-lg p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 transform skew-x-12 translate-x-1/3 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <Award className="mr-2" />
                  <h3 className="text-xl font-bold">
                    Why Fast Response Matters
                  </h3>
                </div>
                <p className="text-blue-100 mb-4 max-w-xl">
                  &quot;Studies show that leads engaged within 5 minutes are 21x
                  more likely to convert. Leads Engager helped us reduce our
                  average response time from hours to just 3 minutes.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-blue-800 font-bold">
                    JT
                  </div>
                  <div>
                    <p className="font-medium">Jason Taylor</p>
                    <p className="text-blue-200 text-sm">
                      Marketing Director, TechStart Inc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

         
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center">
                  <Clock size={18} className="mr-2 text-amber-500" /> Pending
                  Lead Responses
                </CardTitle>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                  Response time matters!
                </span>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="space-y-4">
                  {pendingLeads.map((lead, index) => (
                    <PendingLead key={index} lead={lead} />
                  ))}
                  <button className="w-full py-3 border border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200 mt-4 shadow-sm hover:shadow-md">
                    View All Pending Leads
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

   
          <div className="space-y-8">
           
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-base font-semibold">
                  Engagement Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="space-y-4">
                  {[
                    {
                      label: "Response Rate",
                      value: "83.5%",
                      icon: <MessageSquare size={20} />,
                      change: "+12.5%",
                    },
                    {
                      label: "Avg Response Time",
                      value: "7 min",
                      icon: <Clock size={20} />,
                      change: "-15.3%",
                    },
                    {
                      label: "Conversion Rate",
                      value: "24.8%",
                      icon: <TrendingUp size={20} />,
                      change: "+3.7%",
                    },
                  ].map((stat, index) => (
                    <EngagementStat key={index} {...stat} />
                  ))}
                </div>
              </CardContent>
            </Card>

            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b">
                <CardTitle className="text-base font-semibold flex items-center">
                  <BellRing size={18} className="mr-2 text-blue-600" />{" "}
                  Today&apos;s Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="space-y-4">
                  {reminders.map((reminder, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <p className="text-gray-800">{reminder}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
                    <Send size={18} className="mr-2" /> Send Campaign Now
                  </button>
                </div>
              </CardContent>
            </Card>

            
            <Card className="bg-blue-50 border border-blue-100 shadow-lg overflow-hidden">
              <div className="absolute w-16 h-16 bg-blue-200 rounded-full -top-8 -right-8"></div>
              <div className="absolute w-8 h-8 bg-blue-200 rounded-full bottom-12 left-4"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="text-center p-4">
                  <FileText size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-800 mb-2 text-lg">
                    New to Leads Engager?
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Download our sample Excel template to get started quickly.
                  </p>
                  <button className="w-full py-2 bg-white border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                    Download Template
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
        <div className="mt-12 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Why Choose Leads Engager?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Our platform helps you engage leads faster and more effectively,
            increasing your conversion rates and growing your business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
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
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div> */}

      </>
  );
};

QuickActionButton.displayName = "QuickActionButton";
EngagementStat.displayName = "EngagementStat";
PendingLead.displayName = "PendingLead";

export default LeadsEngagerDashboard;
