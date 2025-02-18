"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import NotFoundPage from "@/components/404";
import { Alert } from "@/components/ui/alert";
import { useEngagement } from "./hooks/useEngagement";
import { useMessageHistory } from "@/hooks/useHistory";
import {EngagementHeader} from "@/components/engagement/engagementHeader";
import QuickActions from  "./QuickActions";
import ActionCenter from "./ActionCenter";
import EngagementStats from "./EngagementStats";
import RecentActivity from "./RecentActivity";
import MessageTracker from "@/components/engagement/MessageTracker";
import CommonModal from "@/components/PopUp/engagement/CommonPopup";

const EngagementDetails: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const {
    engagement,
    categories,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    statuses,
    isLoading,
    error,
    isNotFound,
    handleCategoryChange,
    handleDeleteEngagement,
    actionLoading,
  } = useEngagement(slug);

  const {
    messages,
    loading: messageLoading,
    error: historyError,
  } = useMessageHistory({
    engagementId: slug,
  });

  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    type: "",
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="fadeIn">
      <Header />
      <div className="mx-auto overflow-y-scroll p-6 h-screen mb-12 space-y-6">
        {error && <Alert variant="error" description={error} />}

        <Card className="border-none shadow-lg">
          <div className="p-6">
            <EngagementHeader
              engagement={engagement}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onDelete={handleDeleteEngagement}
              actionLoading={actionLoading}
            />
            <QuickActions onAction={(type) => setActiveModal({ isOpen: true, type })} />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCenter className="md:col-span-2" />
          <EngagementStats engagement={engagement} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity replies={[]} />
          {messageLoading ? (
            <LoadingMessages />
          ) : historyError ? (
            <Alert variant="error" description={historyError} className="mt-4" />
          ) : (
            <MessageTracker messages={messages} />
          )}
        </div>
      </div>

      <CommonModal
        isOpen={activeModal.isOpen}
        type={activeModal.type}
        engagementId={slug}
        onClose={() => setActiveModal({ isOpen: false, type: "" })}
      />
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col justify-center items-center h-screen p-6">
    <div className="animate-pulse space-y-4 w-full max-w-md">
      <div className="h-12 bg-gray-300 rounded w-3/4" />
      <div className="h-8 bg-gray-300 rounded w-full" />
      <div className="h-8 bg-gray-300 rounded w-full" />
    </div>
  </div>
);

const LoadingMessages = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
  </div>
);

export default React.memo(EngagementDetails);