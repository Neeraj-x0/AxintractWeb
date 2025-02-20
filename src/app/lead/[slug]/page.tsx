"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  BarChart,
  Download,
  DollarSign,
  Video,
  Users,
  ArrowUpRight,
  Delete,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";
import useAxios from "@/lib";
import NotFoundPage from "@/components/404";
import Axios from "axios";
import EmailPopup from "@/components/PopUp/EmailPopUp";
import WhatsAppPopup from "@/components/PopUp/WhatsAppPopup";

const LeadManagement = () => {
  const axios = useAxios();
  const [lead, setLead] = useState({
    id: "",
    name: "",
    status: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const [isNotFound, setIsNotFound] = useState(false);

  // Modal states with type
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    type: "", // "call", "whatsapp", "email", "reminder"
  });

  const quickActions = useMemo(
    () => [
      {
        icon: Phone,
        label: "Schedule Call",
        color: "bg-blue-50 text-blue-600",
        type: "call",
      },
      {
        icon: MessageCircle,
        label: "WhatsApp",
        color: "bg-green-50 text-green-600",
        type: "whatsapp",
      },
      {
        icon: Mail,
        label: "Send Email",
        color: "bg-purple-50 text-purple-600",
        type: "email",
      },
      {
        icon: Bell,
        label: "Add Reminder",
        color: "bg-yellow-50 text-yellow-600",
        type: "reminder",
      },
    ],
    []
  );

  const handleModalOpen = (type: string) => {
    setActiveModal({
      isOpen: true,
      type,
    });
  };

  const handleModalClose = () => {
    setActiveModal({
      isOpen: false,
      type: "",
    });
  };

  // Rest of your existing code...
  const actions = useMemo(
    () => [
      {
        icon: Video,
        label: "Schedule Demo",
        color: "bg-purple-50 text-purple-600",
      },
      {
        icon: FileText,
        label: "Send Proposal",
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
        icon: Download,
        label: "Export Data",
        color: "bg-gray-50 text-gray-600",
      },
      {
        icon: DollarSign,
        label: "Send Invoice",
        color: "bg-indigo-50 text-indigo-600",
      },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        title: "Email Sent",
        description: "Product demo invitation sent",
        time: "2 hours ago",
      },
      {
        id: 2,
        title: "Call Scheduled",
        description: "Call scheduled with product specialist",
        time: "4 hours ago",
      },
      {
        id: 3,
        title: "Proposal Sent",
        description: "Proposal sent to client",
        time: "1 day ago",
      },
    ],
    []
  );

  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

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

  const fetchLead = async () => {
    try {
      const response = await axios.get(`/api/lead/${slug}`);
      if (response.request.status === 400) {
        console.error("Lead not found");
      }
      setLead(response.data);
    } catch (error) {
      if (Axios.isAxiosError(error) && error.response) {
        console.error("Error fetching lead:", error.response.data);
        if (error.response.status === 400) {
          setIsNotFound(true);
          return;
        }
      } else {
        console.error("Error fetching lead:", error);
      }
      setError("Failed to fetch lead. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLead(), fetchSettings()]);
    };

    initializeData();
  }, [slug]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        `/api/lead/${lead.id}`,
        { status: newStatus },
        
      );

      if (response.status === 200) {
        setLead((prev) => ({ ...prev, status: newStatus }));
        setIsStatusDropdownOpen(false);
        alert("Status updated successfully.");
      }
    } catch (error) {
      setError("Failed to update status. Please try again.");
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        `/api/lead/${lead.id}`,
        { category: newCategory },
        
      );

      if (response.status === 200) {
        setLead((prev) => ({ ...prev, category: newCategory }));
        setIsCategoryDropdownOpen(false);
        alert("Category updated successfully.");
      }
    } catch (error) {
      setError("Failed to update category. Please try again.");
      console.error("Error updating category:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      setActionLoading(true);
      const response = await axios.delete(`/api/lead/${lead.id}`);
      if (response.status === 200) {
        alert("Lead deleted successfully.");
        window.location.href = "/";
      }
    } catch (error) {
      setError("Failed to delete lead. Please try again.");
      console.error("Error deleting lead:", error);
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

  const currentLead = {
    ...lead,
    company: "Tech Corp",
    priority: "High Priority",
    engagementScore: 85,
    responseRate: "92%",
    lastContact: "2d ago",
  };

  return (
    <>
      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <div className="fadeIn">
          <div className="mx-auto overflow-y-scroll p-6 h-screen mb-12 space-y-6">
            {error && <p className="text-red-600">{error}</p>}

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-gray-900 py-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {lead.name}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{lead.category}</span>
                        <span>•</span>
                        <span className="text-indigo-600">{lead.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="hover:bg-green-50"
                        onClick={() =>
                          setIsStatusDropdownOpen(!isStatusDropdownOpen)
                        }
                        disabled={actionLoading}
                      >
                        Update Status
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                      {isStatusDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow-lg">
                          {statuses.map((status) => (
                            <div
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

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

                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteLead}
                      disabled={actionLoading}
                    >
                      <Delete className="w-4 h-4 mr-2" />
                      Delete Lead
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 max-w-[50vw] md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleModalOpen(action.type)}
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

            <EmailPopup
              isOpen={
                (activeModal.isOpen && activeModal.type === "email") || false
              }
              onClose={handleModalClose}
              clientId={slug || ""}
            />
            <WhatsAppPopup
              isOpen={
                (activeModal.isOpen && activeModal.type === "whatsapp") || false
              }
              onClose={handleModalClose}
              clientId={slug || ""}
            />

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
                        onClick={() => console.log(`${action.label} clicked`)}
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
              {/* Lead Score & Engagement */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 my-4">
                    Lead Score
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Engagement Score
                      </span>
                      <span className="text-lg font-semibold text-indigo-600">
                        {currentLead.engagementScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${currentLead.engagementScore}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Response Rate
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {currentLead.responseRate}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Last Contact
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {currentLead.lastContact}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Recent Activity */}
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
          </div>
        </div>
      )}
    </>
  );
};

export default LeadManagement;
