import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Mail, Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SystemInfo {
  currentDateTime: string;
  username: string;
}

interface LeadInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Reply {
  id: string;
  messageId: string;
  leadInfo: LeadInfo;
  message: string;
  replyStatus: "Replied" | "Pending";
  timestamp: string;
  source: "whatsapp" | "email";
  messageType: string;
}

interface ReplyTrackerProps {
  replies: Reply[];
}

const SystemInfoBar: React.FC<{ systemInfo: SystemInfo }> = React.memo(
  ({ systemInfo }) => (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b rounded-t-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-mono">
            {systemInfo.currentDateTime}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 font-mono">
          {systemInfo.username}
        </span>
      </div>
    </div>
  )
);

const ReplyItem: React.FC<{ reply: Reply }> = React.memo(({ reply }) => {
  return (
    <div className="flex flex-col space-y-3 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      {/* Header with lead info and timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gray-100">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {reply.leadInfo.name}
            </p>
            <p className="text-xs text-gray-500">
              {reply.source === "whatsapp"
                ? reply.leadInfo.phone
                : reply.leadInfo.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(reply.timestamp), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{format(new Date(reply.timestamp), "HH:mm:ss")}</span>
          </div>
        </div>
      </div>

      {/* Message content */}
      <div className="ml-9">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {reply.message}
        </div>
      </div>

      {/* Footer with status and source */}
      <div className="ml-9 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {reply.source === "whatsapp" ? (
            <MessageSquare className="w-4 h-4 text-green-500" />
          ) : (
            <Mail className="w-4 h-4 text-blue-500" />
          )}
          <span
            className={`text-xs ${
              reply.source === "whatsapp" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {reply.source === "whatsapp" ? "WhatsApp" : "Email"}
          </span>
        </div>
      </div>
    </div>
  );
});

ReplyItem.displayName = "ReplyItem";
SystemInfoBar.displayName = "SystemInfoBar";

export const ReplyTracker: React.FC<ReplyTrackerProps> = React.memo(
  ({ replies}) => (
    <Card className="mb-6">
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Reply Tracking
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </span>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2">
          {replies.length > 0 ? (
            replies.map((reply) => <ReplyItem key={reply.id} reply={reply} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              No replies to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);

ReplyTracker.displayName = "ReplyTracker";

export default ReplyTracker;
