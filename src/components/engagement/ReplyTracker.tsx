import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  User, 
  Calendar,
  MessageCircle,
  ChevronRight 
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../MotionComponents";

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
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

const ReplyItem: React.FC<{ reply: Reply; index: number }> = React.memo(
  ({ reply, index }) => {
    const isWhatsApp = reply.source === "whatsapp";
    
    return (
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group hover:bg-gray-50 rounded-xl border p-4 transition-all duration-200"
      >
        {/* Header with lead info and timestamp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isWhatsApp ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <User className={`w-4 h-4 ${
                isWhatsApp ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {reply.leadInfo.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isWhatsApp ? (
                  <MessageSquare className="w-3 h-3 text-green-500" />
                ) : (
                  <Mail className="w-3 h-3 text-blue-500" />
                )}
                <p className="text-xs text-gray-500">
                  {isWhatsApp ? reply.leadInfo.phone : reply.leadInfo.email}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(reply.timestamp), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(reply.timestamp), "HH:mm:ss")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${isWhatsApp ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {isWhatsApp ? 'WhatsApp' : 'Email'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${reply.replyStatus === "Replied" 
                ? 'bg-green-50 text-green-600' 
                : 'bg-yellow-50 text-yellow-600'}`}>
              {reply.replyStatus}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </MotionDiv>
    );
  }
);

export const ReplyTracker: React.FC<ReplyTrackerProps> = React.memo(
  ({ replies }) => (
    <Card className="border-none shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reply Tracking
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600">
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </span>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2">
          <AnimatePresence>
            {replies.length > 0 ? (
              replies.map((reply, index) => (
                <ReplyItem key={reply.id} reply={reply} index={index} />
              ))
            ) : (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No replies yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Replies will appear here once received
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
);

ReplyItem.displayName = "ReplyItem";
SystemInfoBar.displayName = "SystemInfoBar";
ReplyTracker.displayName = "ReplyTracker";

export default ReplyTracker;