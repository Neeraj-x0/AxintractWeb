import { useState, useEffect } from "react";
import axios from "@/lib";

interface UseMessageHistoryProps {
  engagementId?: string;
  refreshInterval?: number;
}

export const useMessageHistory = ({
  engagementId,
  refreshInterval = 30000,
}: UseMessageHistoryProps) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `/api/engagements/${engagementId}/messages`
      );
      setMessages(response.data.data);
      setError("");
    } catch {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (engagementId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [engagementId, refreshInterval]);

  return { messages, loading, error, refetch: fetchMessages };
};
