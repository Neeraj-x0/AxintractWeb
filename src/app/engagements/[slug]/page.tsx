"use client";
import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import NotFoundPage from "@/components/404";
import { Alert } from "@/components/ui/alert";
import { useEngagement } from "@/components/engagement/hooks/useEngagement";
import { useMessageHistory } from "@/hooks/useHistory";
import { EngagementHeader } from "@/components/engagement/engagementHeader";
import { QuickActions } from "@/components/engagement/QuickActions";
import { ActionCenter } from "@/components/engagement/ActionCenter";
import { EngagementStats } from "@/components/engagement/EngagementStats";
import ReplyTracker from "@/components/engagement/ReplyTracker";
import SetReminderModal from "@/components/PopUp/setReminder";
import { Loader2 } from "lucide-react";
import CommonModal from "@/components/PopUp/engagement/CommonPopup";
import MessageTracker from "@/components/engagement/MessageTracker";

const EngagementDetails: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const {
    engagement,
    categories,
    isLoading,
    error,
    replies,
    isNotFound,
    handleCategoryChange,
    handleDeleteEngagement,
    actionLoading,
  } = useEngagement(slug);

  const {
    messages,
    loading: messageLoading,
    error: historyError,
  } = useMessageHistory({ engagementId: slug });

  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    type: string;
    data?: unknown;
  }>({ isOpen: false, type: "" });

  const handleQuickAction = useCallback((type: string, data?: unknown) => {
    setActiveModal({ isOpen: true, type, data });
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveModal({ isOpen: false, type: "", data: undefined });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex w-full flex-col min-h-screen max-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <main className="h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className=" mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert
                variant="error"
                description={error}
                className="mb-4 sticky top-0 z-40"
              />
            )}

            {/* Engagement Header Card */}
            <Card className="border-none shadow-lg bg-white">
              <div className="p-4 space-y-4">
                <EngagementHeader
                  engagement={engagement}
                  categories={categories}
                  onCategoryChange={handleCategoryChange}
                  onDelete={handleDeleteEngagement}
                  actionLoading={actionLoading}
                />
                <QuickActions onAction={handleQuickAction} />
              </div>
            </Card>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Action Center and Reply Tracker */}
              <div className="lg:col-span-2 space-y-4">
                <ActionCenter />
                <ReplyTracker replies={replies} />
              </div>

              {/* Right Column - Stats and Message Tracker */}
              <div className="space-y-4">
               
                  <EngagementStats engagement={engagement} />
               
                <Card className="bg-white">
                  {messageLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  ) : historyError ? (
                    <Alert variant="error" description={historyError} />
                  ) : (
                    <MessageTracker messages={messages} />
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {activeModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {activeModal.type === "reminder" ? (
              <SetReminderModal
                onClose={handleModalClose}
                isOpen={activeModal.isOpen}
                engagementId={slug}
              />
            ) : activeModal.type === "message" ? (
              <CommonModal
                onClose={handleModalClose}
                isOpen={activeModal.isOpen}
                engagementId={slug}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(EngagementDetails);
