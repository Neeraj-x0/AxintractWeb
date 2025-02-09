/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import {
  MessageCircle,
  
  FileText,
  Bell,
  Clock,
  BarChart,
  Download,
  Users,
  ArrowUpRight,
  Trash,
  ChevronDown,
  Reply,
  ListChecks,
  Calendar,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import axios from "@/lib";
import NotFoundPage from "@/components/404";
import CommonPopUp from "@/components/PopUp/engagement/CommonPopup";
import { useMessageHistory } from "@/hooks/useHistory";
import MessageTracker from "@/components/engagement/MessageTracker";
import { Alert } from "@/components/ui/alert";

const EngagementDetails = () => {
  const [engagement, setEngagement] = useState({
    id: "",
    name: "",
    status: "",
    category: "",
    totalMessages: 0,
    replies: 0,
    notes: "",
    lastMessage: null,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const {
    messages,
    loading,
    error: historyError,
  } = useMessageHistory({
    engagementId: slug,
  });

  // Modal states
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    type: "", // "message", "email", "reminder", "notes"
  });

  const quickActions = useMemo(
    () => [
      {
        icon: MessageCircle,
        label: "Send Message",
        color: "bg-blue-50 text-blue-600",
        type: "message",
      },
      {
        icon: Reply,
        label: "Track Reply",
        color: "bg-green-50 text-green-600",
        type: "reply",
      },
      {
        icon: Bell,
        label: "Set Reminder",
        color: "bg-yellow-50 text-yellow-600",
        type: "reminder",
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        icon: ListChecks,
        label: "Update Status",
        color: "bg-purple-50 text-purple-600",
      },
      {
        icon: FileText,
        label: "Add Notes",
        color: "bg-blue-50 text-blue-600",
      },
      {
        icon: Users,
        label: "Assign Team",
        color: "bg-green-50 text-green-600",
      },
      {
        icon: BarChart,
        label: "View Analytics",
        color: "bg-yellow-50 text-yellow-600",
      },
      {
        icon: Calendar,
        label: "Schedule Follow-up",
        color: "bg-gray-50 text-gray-600",
      },
      {
        icon: Download,
        label: "Export Data",
        color: "bg-indigo-50 text-indigo-600",
      },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        title: "Message Sent",
        description: "Follow-up message sent",
        time: "2 hours ago",
      },
      {
        id: 2,
        title: "Status Updated",
        description: "Engagement status changed to Qualified",
        time: "4 hours ago",
      },
      {
        id: 3,
        title: "Reply Received",
        description: "Client responded to previous message",
        time: "1 day ago",
      },
    ],
    []
  );

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`/api/settings`);
      const { categories, statuses } = response.data;
      setCategories(categories);
      setStatuses(statuses);
    } catch (error) {
      setError("Failed to fetch settings");
      console.error("Settings fetch error:", error);
    }
  };

  const fetchEngagement = async () => {
    try {
      const response = await axios.get(`/api/engagements/${slug}`);
      setEngagement(response.data.data);
    } catch (error: unknown) {
      if (
        (error as { response?: { status: number } }).response?.status === 404
      ) {
        setIsNotFound(true);
      } else {
        setError("Failed to fetch engagement details");
      }
      console.error("Error fetching engagement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchEngagement(), fetchSettings()]);
    };

    if (slug) {
      initializeData();
    }
  }, [slug]);

  const handleCategoryChange = async (newCategory: string) => {
    try {
      setActionLoading(true);
      await axios.post(`/api/engagements/${slug}`, {
        category: newCategory,
      });
      setEngagement((prev) => ({ ...prev, category: newCategory }));
      setIsCategoryDropdownOpen(false);
    } catch (error) {
      setError("Failed to update category");
      console.error("Error updating category:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEngagement = async () => {
    if (!window.confirm("Are you sure you want to delete this engagement?")) {
      return;
    }
    try {
      setActionLoading(true);
      await axios.delete(`/api/engagements/${slug}`);
      window.location.href = "/engagements";
    } catch (error) {
      setError("Failed to delete engagement");
      console.error("Error deleting engagement:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-6">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-12 bg-gray-300 rounded w-3/4"></div>
          <div className="h-8 bg-gray-300 rounded w-full"></div>
          <div className="h-8 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const currentEngagement = {
    ...engagement,
    engagementScore:
      Math.round((engagement.replies / engagement.totalMessages) * 100) || 0,
    responseRate: `${
      Math.round((engagement.replies / engagement.totalMessages) * 100) || 0
    }%`,
    lastContact: engagement.lastMessage
      ? new Date(engagement.lastMessage).toLocaleDateString()
      : "Never",
  };

  return (
    <>
      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <div className="fadeIn">
          <Header />
          <div className="mx-auto overflow-y-scroll p-6 h-screen mb-12 space-y-6">
            {error && <p className="text-red-600">{error}</p>}

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between text-gray-900 py-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {engagement.name}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{engagement.category}</span>
                        <span>•</span>
                        <span className="text-indigo-600">
                          {engagement.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {/* Category Dropdown */}
                    <div className="relative">
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                        disabled={actionLoading}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Update Category
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                      {isCategoryDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow-lg">
                          {categories.map((category) => (
                            <div
                              key={category}
                              onClick={() => handleCategoryChange(category)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteEngagement}
                      disabled={actionLoading}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 max-w-[50vw] md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveModal({ isOpen: true, type: action.type })
                      }
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-3 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Action Center */}
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 my-4">
                    Actions & Tasks
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Score & Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 my-4">
                    Engagement Score
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Response Rate
                      </span>
                      <span className="text-lg font-semibold text-indigo-600">
                        {currentEngagement.engagementScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${currentEngagement.engagementScore}%`,
                        }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Total Messages
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {currentEngagement.totalMessages}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Total Replies
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {currentEngagement.replies}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 my-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                          <span className="text-xs text-gray-400">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/*Replies for engagement*/}
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : historyError ? (
                <Alert
                  variant="error"
                  description={historyError}
                  className="mt-4"
                />
              ) : (
                <MessageTracker messages={messages} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal.isOpen && (
        <>
          {activeModal.type === "message" && (
            <CommonPopUp
              isOpen={activeModal.isOpen}
              onClose={() => setActiveModal({ isOpen: false, type: "" })}
              engagementId={slug}
            />
          )}
        </>
      )}
    </>
  );
};

export default EngagementDetails;
