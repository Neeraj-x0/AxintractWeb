/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  MessageCircle,
  Mail,
  Phone,
  BarChart2,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
} from "lucide-react";
import { Overlay } from "@/components/overlay";

const FollowUpCampaign = () => {
  const campaignStats = [
    { label: "Active Leads", value: "1,284", trend: "+12%", icon: Users },
    { label: "Response Rate", value: "68%", trend: "+5%", icon: Activity },
    { label: "Conversion Rate", value: "24%", trend: "+3%", icon: Target },
    { label: "Avg Response Time", value: "4.2h", trend: "-8%", icon: Clock },
  ];

  const campaignStages = [
    { name: "Initial Contact", count: 245, color: "bg-blue-500" },
    { name: "Follow-up", count: 182, color: "bg-indigo-500" },
    { name: "Meeting Scheduled", count: 94, color: "bg-purple-500" },
    { name: "Proposal Sent", count: 67, color: "bg-pink-500" },
  ];

  return (
    <Overlay />
    // <div className="p-6 space-y-6 fadeIn">
    //   <div className="flex justify-between items-center">
    //     <div>
    //       <h1 className="text-2xl font-bold text-gray-900">Q1 Product Launch Campaign</h1>
    //       <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
    //         <span className="flex items-center">
    //           <Calendar className="w-4 h-4 mr-1" />
    //           Started Jan 15, 2025
    //         </span>
    //         <span>•</span>
    //         <span className="text-green-600 flex items-center">
    //           <CheckCircle className="w-4 h-4 mr-1" />
    //           Active
    //         </span>
    //       </div>
    //     </div>
    //     <div className="flex space-x-3">
    //       <Button variant="outline" className="flex items-center">
    //         <Settings className="w-4 h-4 mr-2" />
    //         Campaign Settings
    //       </Button>
    //       <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
    //         <BarChart2 className="w-4 h-4 mr-2" />
    //         View Analytics
    //       </Button>
    //     </div>
    //   </div>
    //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    //     {campaignStats.map((stat, index) => (
    //       <Card key={index}>
    //         <CardContent className="p-6">
    //           <div className="flex justify-between mt-2 items-start">
    //             <div >
    //               <p className="text-sm font-medium text-gray-500">{stat.label}</p>
    //               <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
    //             </div>
    //             <div className={`p-2 rounded-lg mt-4 align-middle  ${
    //               stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
    //             }`}>
    //               <stat.icon className="w-5 h-5" />
    //             </div>
    //           </div>
    //           <div className="mt-2 text-sm font-medium text-gray-900">
    //             {stat.trend}
    //             <span className="text-gray-500 ml-1">vs last month</span>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Campaign Stages</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="flex justify-between items-center space-x-4">
    //         {campaignStages.map((stage, index) => (
    //           <div key={index} className="flex-1">
    //             <div className="flex justify-between items-center mb-2">
    //               <span className="text-sm font-medium text-gray-700">{stage.name}</span>
    //               <span className="text-sm font-bold text-gray-900">{stage.count}</span>
    //             </div>
    //             <div className="w-full bg-gray-100 rounded-full h-2">
    //               <div
    //                 className={`${stage.color} h-2 rounded-full`}
    //                 style={{ width: `${(stage.count / 245) * 100}%` }}
    //               ></div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle className="flex items-center">
    //           <Mail className="w-5 h-5 mr-2 text-blue-600" />
    //           Email Campaigns
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Open Rate</span>
    //             <span className="text-lg font-semibold text-gray-900">42%</span>
    //           </div>
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Click Rate</span>
    //             <span className="text-lg font-semibold text-gray-900">18%</span>
    //           </div>
    //           <Button variant="outline" className="w-full">View Details</Button>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle className="flex items-center">
    //           <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
    //           SMS/WhatsApp
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Response Rate</span>
    //             <span className="text-lg font-semibold text-gray-900">56%</span>
    //           </div>
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Avg Response Time</span>
    //             <span className="text-lg font-semibold text-gray-900">2.4h</span>
    //           </div>
    //           <Button variant="outline" className="w-full">View Details</Button>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle className="flex items-center">
    //           <Phone className="w-5 h-5 mr-2 text-purple-600" />
    //           Phone Calls
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Connection Rate</span>
    //             <span className="text-lg font-semibold text-gray-900">32%</span>
    //           </div>
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-gray-500">Avg Call Duration</span>
    //             <span className="text-lg font-semibold text-gray-900">4.8m</span>
    //           </div>
    //           <Button variant="outline" className="w-full">View Details</Button>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Recent Activities</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="space-y-4">
    //         {[
    //           {
    //             type: "Email",
    //             description: "Follow-up email sent to 124 leads",
    //             time: "2 hours ago",
    //             icon: Mail,
    //             color: "bg-blue-50 text-blue-600"
    //           },
    //           {
    //             type: "WhatsApp",
    //             description: "Campaign message delivered to 89 leads",
    //             time: "4 hours ago",
    //             icon: MessageCircle,
    //             color: "bg-green-50 text-green-600"
    //           },
    //           {
    //             type: "Alert",
    //             description: "Response rate dropped below threshold",
    //             time: "6 hours ago",
    //             icon: AlertCircle,
    //             color: "bg-yellow-50 text-yellow-600"
    //           }
    //         ].map((activity, index) => (
    //           <div key={index} className="flex items-start space-x-4">
    //             <div className={`p-2 rounded-lg ${activity.color}`}>
    //               <activity.icon className="w-5 h-5" />
    //             </div>
    //             <div className="flex-1">
    //               <p className="text-sm font-medium text-gray-900">{activity.type}</p>
    //               <p className="text-sm text-gray-500">{activity.description}</p>
    //               <span className="text-xs text-gray-400">{activity.time}</span>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </CardContent>
    //   </Card>

    // </div>
  );
};

export default FollowUpCampaign;
