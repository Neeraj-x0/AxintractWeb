import { useState, useEffect } from 'react';
import axios from '@/lib';
import { toast } from 'react-hot-toast';

export const useMetadata = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesRes, statusesRes, messageCountRes] = await Promise.all([
          axios.get("/api/settings/categories"),
          axios.get("/api/settings/statuses"),
          axios.get("/api/engagements/messageCount"),
        ]);

        setCategories(categoriesRes.data.categories);
        setStatuses(statusesRes.data.statuses);
        setMessageCount(messageCountRes.data.data);
      } catch  {
        toast.error("Failed to fetch metadata");
      }
    };

    fetchMetadata();
  }, []);

  return { categories, statuses, messageCount };
};