"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Loader2, MessageCircle, Reply, Users } from "lucide-react";
import CreateEngagementPopup from "@/components/PopUp/addEngagement";
import { AnalyticsCard } from "@/components/engagement/AnalyticsCard";
import { EngagementTable } from "@/components/engagement/EngagementTable";
import { FilterBar } from "@/components/engagement/FilterBar";
import { ActionBar } from "@/components/engagement/ActionBar";
import { useEngagements } from "@/hooks/useEngagement";
import { useMetadata } from "@/hooks/useMetadata";
import { useFilters } from "@/hooks/useFilters";

const EngagementDashboard: React.FC = () => {
  const {
    engagements,
    loading,
    handleAddEngagement,
    handleBulkAction,
    fetchEngagements,
  } = useEngagements();

  const { categories, statuses, messageCount } = useMetadata();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch engagements on initial load
  useEffect(() => {
    fetchEngagements();
  }, [fetchEngagements]);

  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    handleSearch,
    handleStatusFilter,
    handleCategoryFilter,
    filteredEngagements,
  } = useFilters(engagements);

  // Memoized analytics calculations
  const analytics = useMemo(() => {
    const totalEngagements = engagements.length;
    const totalReplies = engagements.reduce((sum, eng) => sum + eng.replies, 0);
    const totalMessages = engagements.reduce(
      (sum, eng) => sum + eng.totalMessages,
      0
    );

    return {
      totalEngagements,
      totalMessages: messageCount,
      totalReplies,
      responseRate:
        totalMessages > 0
          ? ((totalReplies / totalMessages) * 100).toFixed(1)
          : "0",
    };
  }, [engagements, messageCount]);

  // Memoized analytics cards configuration
  const analyticsCards = useMemo(
    () => [
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
    ],
    [analytics]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(
        checked
          ? filteredEngagements
              .filter((e) => e._id !== undefined)
              .map((e) => e._id!.toString())
          : []
      );
    },
    [filteredEngagements]
  );

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-3 gap-6 mb-8">
        {analyticsCards.map((card, index) => (
          <AnalyticsCard key={index} {...card} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <ActionBar
            selectedIds={selectedIds}
            categories={categories}
            statuses={statuses}
            onBulkAction={handleBulkAction}
            onAddNew={() => setIsModalOpen(true)}
          />

          <FilterBar
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            categories={categories}
            statuses={statuses}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onCategoryFilter={handleCategoryFilter}
          />
        </div>

        <EngagementTable
          engagements={filteredEngagements}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
        />
      </div>

      <CreateEngagementPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await handleAddEngagement(data);
        }}
        categories={categories}
        statuses={statuses}
      />
    </div>
  );
};

export default React.memo(EngagementDashboard);
