import React from "react";
import MessageTracker from "@/components/engagement/MessageTracker";

const EngagementHistory: React.FC = () => {
  // Sample data - replace with your actual data
  const sampleMessages = [
    {
      id: "1",
      content: "Hello! This is a test WhatsApp message.",
      sender: "Neeraj-x0",
      timestamp: "2025-02-07 20:38:44",
      type: "whatsapp" as const,
      status: "delivered" as const,
      recipient: "+1234567890",
    },
    {
      id: "2",
      content: "Important meeting details for tomorrow",
      sender: "Neeraj-x0",
      timestamp: "2025-02-07 20:35:12",
      type: "email" as const,
      status: "sent" as const,
      recipient: "user@example.com",
    },
    {
      id: "3",
      content: "Following up on our previous conversation",
      sender: "Neeraj-x0",
      timestamp: "2025-02-07 19:45:00",
      type: "whatsapp" as const,
      status: "read" as const,
      recipient: "+1987654321",
    },
  ];

  return (
    <div className="p-6">
      <MessageTracker messages={sampleMessages} />
    </div>
  );
};

export default EngagementHistory;
