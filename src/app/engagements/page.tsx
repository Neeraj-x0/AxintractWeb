"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  MessageCircle,
  Reply,
  Users,
} from "lucide-react";
import CreateEngagementPopup from "@/components/PopUp/addEngagement";
import { toast } from "react-hot-toast";
import { IEngagement } from "@/types";
import axios from "@/lib";
import Link from "next/link";

const EngagementDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [engagements, setEngagements] = useState<IEngagement[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<IEngagement[]>(
    []
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const [statuses, setStatuses] = useState<string[]>([]);

  // Calculate analytics
  const analytics = {
    totalEngagements: engagements.length,
    totalMessages: engagements.reduce((sum, eng) => sum + eng.totalMessages, 0),
    totalReplies: engagements.reduce((sum, eng) => sum + eng.replies, 0),
    responseRate:
      engagements.length > 0
        ? (
            (engagements.reduce((sum, eng) => sum + eng.replies, 0) /
              engagements.reduce((sum, eng) => sum + eng.totalMessages, 0)) *
            100
          ).toFixed(1)
        : 0,
  };

  const analyticsCards = [
    {
      title: "Total Engagements",
      value: analytics.totalEngagements,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
      description: "Active conversations",
    },
    {
      title: "Total Messages",
      value: analytics.totalMessages,
      icon: MessageCircle,
      color: "bg-purple-50 text-purple-700",
      description: "Messages sent",
    },
    {
      title: "Total Replies",
      value: analytics.totalReplies,
      icon: Reply,
      color: "bg-green-50 text-green-700",
      description: `${analytics.responseRate}% response rate`,
    },
  ];

  const fetchMetadata = async () => {
    try {
      const [categoriesData, statusesData] = await Promise.all([
        axios.get("/api/settings/categories"),
        axios.get("/api/settings/statuses"),
      ]).then((responses) => [
        responses[0].data.categories,
        responses[1].data.statuses,
      ]);
      console.log(categoriesData, statusesData);
      setCategories(categoriesData);
      setStatuses(statusesData);
    } catch {
      toast.error("Failed to fetch metadata");
    }
  };

  const fetchEngagements = async () => {
    try {
      setLoading(true);
      const data = await axios.get("/api/engagements").then((res) => res.data);

      setEngagements(data.data);
      setFilteredEngagements(data.data);
    } catch {
      toast.error("Failed to fetch engagements");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEngagement = useCallback(
    async (data: Partial<IEngagement>) => {
      try {
        setLoading(true);
        await axios.post("/api/engagements", data);
        toast.success("Engagement created successfully");
        fetchEngagements();
        setIsModalOpen(false);
      } catch {
        toast.error("Failed to create engagement");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = engagements.filter(
        (engagement) =>
          engagement.name.toLowerCase().includes(query.toLowerCase()) ||
          engagement.notes?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEngagements(filtered);
    },
    [engagements]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      setStatusFilter(status);
      applyFilters(status, categoryFilter, searchQuery);
    },
    [categoryFilter, searchQuery]
  );

  const handleCategoryFilter = useCallback(
    (category: string) => {
      setCategoryFilter(category);
      applyFilters(statusFilter, category, searchQuery);
    },
    [statusFilter, searchQuery]
  );

  const applyFilters = useCallback(
    (status: string, category: string, search: string) => {
      let filtered = engagements;

      if (status) {
        filtered = filtered.filter((e) => e.status === status);
      }

      if (category) {
        filtered = filtered.filter((e) => e.category === category);
      }

      if (search) {
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.notes?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredEngagements(filtered);
    },
    [engagements]
  );

  const handleBulkAction = async (
    p0: string,
    value: string,
    action: "status" | "category" | "delete"
  ) => {
    try {
      setLoading(true);
      if (action === "delete") {
        axios.delete("/api/engagements", { data: { selectedIds } });
        toast.success("Engagements deleted successfully");
      }
    } catch {
      toast.error(`Failed to ${action} engagements`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(
      checked
        ? filteredEngagements
            .filter((e) => e._id !== undefined)
            .map((e) => e._id!.toString())
        : []
    );
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchEngagements();
    fetchMetadata();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-sm ${card.color} border border-opacity-20`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <Icon className="w-6 h-6 opacity-75" />
              </div>
              <p className="text-sm opacity-75 mb-2">{card.description}</p>
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Add New
            </button>
            {selectedIds.length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  className="border rounded-md px-3 py-2"
                  onChange={(e) =>
                    handleBulkAction("status", e.target.value, "status")
                  }
                >
                  <option value="">Change Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  className="border rounded-md px-3 py-2"
                  onChange={(e) =>
                    handleBulkAction("category", e.target.value, "category")
                  }
                >
                  <option value="">Change Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleBulkAction("delete", "", "delete")}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search engagements..."
                className="pl-10 pr-4 py-2 border rounded-md w-64"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="border rounded-md px-3 py-2"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredEngagements.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Replies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEngagements.map((engagement, index) => (
                <tr
                  key={
                    engagement._id
                      ? engagement._id.toString()
                      : `engagement-${index}`
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={
                        engagement._id
                          ? selectedIds.includes(engagement._id.toString())
                          : false
                      }
                      onChange={() =>
                        engagement._id &&
                        handleSelectOne(engagement._id.toString())
                      }
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {engagement.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.totalMessages}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.replies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.lastMessage
                      ? new Date(engagement.lastMessage).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <Link href={`/engagements/${engagement._id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateEngagementPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEngagement}
        categories={categories}
        statuses={statuses}
      />
    </div>
  );
};

export default EngagementDashboard;
