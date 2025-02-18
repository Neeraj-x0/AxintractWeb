import useAxios from "@/lib";
import {
  IEngagement,
  APIResponse,
  EngagementFilter,
  EngagementStats,
} from "@/types";

const formatUTCDate = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

// eslint-disable-next-line react-hooks/rules-of-hooks
const axios = useAxios();
export const engagementService = {

  /**
   * Create a new engagement
   */
  async createEngagement(data: Partial<IEngagement>): Promise<IEngagement> {
  
    try {
      const response = await axios.post<APIResponse<IEngagement>>(
        "/api/engagements",
        {
          ...data,
          timestamp: formatUTCDate(new Date()),
          totalMessages: 0,
          replies: 0,
        }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get all engagements
   */
  async getAllEngagements(): Promise<IEngagement[]> {
    try {
      const response = await axios.get<APIResponse<IEngagement[]>>(
        "/api/engagements"
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get filtered engagements
   */
  async getFilteredEngagements(
    filters: EngagementFilter
  ): Promise<IEngagement[]> {
    try {
      const response = await axios.get<APIResponse<IEngagement[]>>(
        "/api/engagements",
        {
          params: filters,
        }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get engagement by ID
   */
  async getEngagementById(id: string): Promise<IEngagement> {
    try {
      const response = await axios.get<APIResponse<IEngagement>>(
        `/api/engagements/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Update engagement
   */
  async updateEngagement(
    id: string,
    data: Partial<IEngagement>
  ): Promise<IEngagement> {
    try {
      const response = await axios.patch<APIResponse<IEngagement>>(
        `/api/engagements/${id}`,
        {
          ...data,
          lastMessage: formatUTCDate(new Date()),
        }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Delete engagements
   */
  async deleteEngagements(ids: string[]): Promise<void> {
    try {
      await axios.delete("/api/engagements", { data: { ids } });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get engagement statistics
   */
  async getEngagementStats(): Promise<EngagementStats> {
    try {
      const response = await axios.get("/api/engagements/stats");
      return (response.data.data as EngagementStats)!;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Update engagement messages count
   */
  async updateEngagementMessages(
    id: string,
    messageData: { totalMessages: number; replies: number }
  ): Promise<IEngagement> {
    try {
      const response = await axios.patch<APIResponse<IEngagement>>(
        `/api/engagements/${id}/messages`,
        {
          ...messageData,
          lastMessage: formatUTCDate(new Date()),
        }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = (await axios.get(
        "/api/settings/categories"
      )) as APIResponse<{ categories: string[] }>;
      return response.categories || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get statuses
   */
  async getStatuses(): Promise<string[]> {
    try {
      const response = (await axios.get(
        "/api/settings/statuses"
      )) as APIResponse<{ statuses: string[] }>;
      return response.statuses || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Bulk update engagements
   */
  async bulkUpdateEngagements(
    ids: string[],
    updateData: Partial<IEngagement>
  ): Promise<void> {
    try {
      await axios.patch("/api/engagements/bulk", {
        ids,
        data: {
          ...updateData,
          lastMessage: formatUTCDate(new Date()),
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Search engagements
   */
  async searchEngagements(query: string): Promise<IEngagement[]> {
    try {
      const response = await axios.get<APIResponse<IEngagement[]>>(
        "/api/engagements/search",
        {
          params: { q: query },
        }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Error handling utility
   */
  handleError(error: unknown): Error {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      const message =
        err.response?.data?.message ||
        (error instanceof Error ? error.message : "Unknown error");
      const status = err.response?.status;

      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`);
        case 401:
          return new Error("Unauthorized: Please login again");
        case 403:
          return new Error("Forbidden: Insufficient permissions");
        case 404:
          return new Error("Engagement not found");
        case 409:
          return new Error(`Conflict: ${message}`);
        default:
          return new Error(`Server Error: ${message}`);
      }
    }
    return new Error("Network Error: Unable to reach server");
  },
};

export default engagementService;
