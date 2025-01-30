"use client";
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Bell,
  Clock,
  CheckCircle,
  BarChart,
  Download,
  DollarSign,
  Video,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/Header";

const LeadManagement = () => {
  const quickActions = useMemo(() => [
    { icon: Phone, label: "Schedule Call", color: "bg-blue-50 text-blue-600" },
    { icon: MessageCircle, label: "WhatsApp", color: "bg-green-50 text-green-600" },
    { icon: Mail, label: "Send Email", color: "bg-purple-50 text-purple-600" },
    { icon: Bell, label: "Add Reminder", color: "bg-yellow-50 text-yellow-600" },
  ], []);

  const actions = useMemo(() => [
    { icon: Video, label: "Schedule Demo", color: "bg-purple-50 text-purple-600" },
    { icon: FileText, label: "Send Proposal", color: "bg-blue-50 text-blue-600" },
    { icon: Users, label: "Assign Team", color: "bg-green-50 text-green-600" },
    { icon: BarChart, label: "View Analytics", color: "bg-yellow-50 text-yellow-600" },
    { icon: Download, label: "Export Data", color: "bg-gray-50 text-gray-600" },
    { icon: DollarSign, label: "Send Invoice", color: "bg-indigo-50 text-indigo-600" },
  ], []);

  const recentActivity = useMemo(() => [1, 2, 3, 4, 5, 6], []);

  return (
    <div className="fadeIn">
      <Header />
      <div className="mx-auto overflow-y-scroll p-6 h-screen mb-12 space-y-6">
        {/* Lead Header with Quick Actions */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-gray-900 py-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Tech Corp</span>
                    <span>•</span>
                    <span className="text-indigo-600">High Priority</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Convert Lead
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 max-w-[50vw] md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button key={index} className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-3 rounded-lg ${action.color} mr-3`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action Center */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 my-4">Actions & Tasks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                  <button key={index} className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Score & Engagement */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 my-4">Lead Score</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Engagement Score</span>
                  <span className="text-lg font-semibold text-indigo-600">85/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Response Rate</div>
                    <div className="text-lg font-semibold text-gray-900">92%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Last Contact</div>
                    <div className="text-lg font-semibold text-gray-900">2d ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 my-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Sent</p>
                    <p className="text-sm text-gray-500">Product demo invitation sent</p>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadManagement;
