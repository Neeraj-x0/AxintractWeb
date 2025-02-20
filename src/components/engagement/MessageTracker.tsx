import React from "react";
import { formatDistance } from "date-fns";
import { MessageSquare, Mail, Clock, Reply, ChevronRight } from "lucide-react";
import { MotionDiv } from "../MotionComponents";

interface Message {
  _id?: string;
  source: 'whatsapp' | 'email';
  type: string;
  replyPercentage: number;
  timestamp: number;
  messageId: string;
  totalMessages: {
    whatsapp: number;
    email: number;
  };
  repliedMessages: number;
}

interface MessageTrackerProps {
  messages: Message[];
}

const getPercentageColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getPercentageBg = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-50";
  if (percentage >= 50) return "bg-yellow-50";
  return "bg-red-50";
};

const MessageCard: React.FC<{ message: Message; index: number }> = ({ message, index }) => {
  const isWhatsApp = message.source === "whatsapp";
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group p-4 hover:bg-gray-50 transition-all duration-200 border-b last:border-b-0"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full
              ${isWhatsApp ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}
            >
              {isWhatsApp ? (
                <MessageSquare className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isWhatsApp ? 'WhatsApp' : 'Email'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <time>
                {formatDistance(new Date(message.timestamp), new Date(), {
                  addSuffix: true,
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Message Content */}
        {message.type && (
          <div className="text-sm text-gray-600">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="line-clamp-2">{message.type}</p>
            </div>
          </div>
        )}

        {/* Stats & Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {isWhatsApp && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Reply className="h-4 w-4" />
                  <span>{message.repliedMessages} replies</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getPercentageBg(message.replyPercentage)}`}>
                  <span className={`font-medium ${getPercentageColor(message.replyPercentage)}`}>
                    {message.replyPercentage}% response rate
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">
              Total messages:
              <span className="font-medium ml-1">
                {isWhatsApp ? message.totalMessages.whatsapp : message.totalMessages.email}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const MessageTracker: React.FC<MessageTrackerProps> = ({ messages }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Message History</h2>
          <span className="text-sm text-gray-500">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
        {messages.map((message, index) => (
          <MessageCard key={message.messageId} message={message} index={index} />
        ))}

        {messages.length === 0 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <Mail className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No messages to display</p>
            <p className="text-sm text-gray-400 mt-1">
              Messages will appear here once they are sent
            </p>
          </MotionDiv>
        )}
      </div>
    </div>
  );
};

export default MessageTracker;