import { useState, useCallback, useEffect } from "react";
import useAxios from "@/lib";
import { IEngagement } from "@/types";

export const useEngagement = (slug: string | undefined) => {
  const axios = useAxios();
  const [engagement, setEngagement] = useState<IEngagement>({
    _id: "",
    name: "",
    status: "",
    category: "",
    totalMessages: 0,
    replies: 0,
    notes: "",
    lastMessage: undefined,
    reply: [],
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);
  const [replies, setReplies] = useState([]);

  const fetchReplies = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/engagements/${slug}/replies`);
      setReplies(data.data);
    } catch (error) {
      setError("Failed to fetch replies");
      console.error("Error fetching replies:", error);
    }
  }, [slug,axios]);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/settings`);
      setCategories(data.categories);
      setStatuses(data.statuses);
    } catch (error) {
      setError("Failed to fetch settings");
      console.error("Settings fetch error:", error);
    }
  }, [axios]);

  const fetchEngagement = useCallback(async () => {
    if (!slug) return;

    try {
      const { data } = await axios.get(`/api/engagements/get/${slug}`);
      setEngagement(data.data);
    } catch (error: unknown) {
      if (
        (error as { response?: { status: number } }).response?.status === 404
      ) {
        setIsNotFound(true);
      } else {
        setError("Failed to fetch engagement details");
      }
      console.error("Error fetching engagement:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug,axios]);

  const handleCategoryChange = useCallback(
    async (newCategory: string) => {
      if (!slug) return;

      try {
        setActionLoading(true);
        await axios.post(`/api/engagements/${slug}`, {
          category: newCategory,
        });
        setEngagement((prev) => ({ ...prev, category: newCategory }));
      } catch (error) {
        setError("Failed to update category");
        console.error("Error updating category:", error);
      } finally {
        setActionLoading(false);
      }
    },
    [slug,axios]
  );

  const handleDeleteEngagement = useCallback(async () => {
    if (
      !slug ||
      !window.confirm("Are you sure you want to delete this engagement?")
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await axios.delete(`/api/engagements/${slug}`);
      window.location.href = "/engagements";
    } catch (error) {
      setError("Failed to delete engagement");
      console.error("Error deleting engagement:", error);
    } finally {
      setActionLoading(false);
    }
  }, [slug,axios]);

  useEffect(() => {
    if (slug) {
      Promise.all([fetchEngagement(), fetchSettings(), fetchReplies()]);
    }
  }, [slug, fetchEngagement, fetchSettings, fetchReplies]);

  return {
    engagement,
    categories,
    statuses,
    isLoading,
    error,
    isNotFound,
    replies,
    handleCategoryChange,
    handleDeleteEngagement,
    actionLoading,
  };
};
