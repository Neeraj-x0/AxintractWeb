import React from "react";
import { formatDistance } from "date-fns";
import { MessageSquare, Mail, User, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  type: "whatsapp" | "email";
  status: "sent" | "delivered" | "read" | "failed";
  recipient: string;
}

interface MessageTrackerProps {
  messages: Message[];
}

const MessageTracker: React.FC<MessageTrackerProps> = ({ messages }) => {
  return (
    <div className="w-full  bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Reply History</h2>
      </div>

      <div className="divide-y max-h-96 overflow-x-scroll overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {message.type === "whatsapp" ? (
                  <MessageSquare className="h-4 w-4 text-green-500" />
                ) : (
                  <Mail className="h-4 w-4 text-blue-500" />
                )}
                <span className="font-medium">
                  {message.type === "whatsapp" ? "WhatsApp" : "Email"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <time>
                  {formatDistance(new Date(message.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">{message.content}</div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <User className="h-4 w-4" />
                  <span>From: {message.sender}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <User className="h-4 w-4" />
                  <span>To: {message.recipient}</span>
                </div>
              </div>

              <div
                className={`
                px-2 
                py-1 
                rounded-full 
                text-xs 
                ${message.status === "sent" && "bg-blue-100 text-blue-700"}
                ${
                  message.status === "delivered" &&
                  "bg-green-100 text-green-700"
                }
                ${message.status === "read" && "bg-purple-100 text-purple-700"}
                ${message.status === "failed" && "bg-red-100 text-red-700"}
              `}
              >
                {message.status.charAt(0).toUpperCase() +
                  message.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No messages to display
        </div>
      )}
    </div>
  );
};

export default MessageTracker;
