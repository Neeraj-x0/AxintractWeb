import React from "react";
import { formatDistance } from "date-fns";
import { MessageSquare, Mail, Clock, Reply } from "lucide-react";

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
  if (percentage >= 80) return "bg-green-100";
  if (percentage >= 50) return "bg-yellow-100";
  return "bg-red-100";
};

const MessageTracker: React.FC<MessageTrackerProps> = ({ messages }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Message History</h2>
      </div>

      <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start space-y-2 flex-col">
              {/* Header Section */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {message.source === "whatsapp" ? (
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">WhatsApp</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-600">Email</span>
                    </div>
                  )}
                
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <time>
                    {formatDistance(new Date(message.timestamp), new Date(), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
              </div>

              {/* Message Content */}
              {message.type && (
                <div className="w-full mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {message.type}
                </div>
              )}

              {/* Footer Section */}
              <div className="w-full mt-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  {message.source === "whatsapp" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Reply className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {message.repliedMessages} replies
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full ${getPercentageBg(message.replyPercentage)}`}>
                        <span className={`font-medium ${getPercentageColor(message.replyPercentage)}`}>
                          {message.replyPercentage}% response rate
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Email message</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    Total messages: {" "}
                    <span className="font-medium">
                      {message.source === "whatsapp" 
                        ? message.totalMessages.whatsapp 
                        : message.totalMessages.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No messages to display
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTracker;