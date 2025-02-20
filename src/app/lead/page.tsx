"use client";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import AddLeadsPopup from "@/components/PopUp/addLeadPopup";
import useAxios from "@/lib";
import { Lead } from "@/components/Lead/types";
import ProgressionCards from "@/components/Lead/progressionCard";
import LeadsControls from "@/components/Lead/LeadsControler";
import LeadsTableHeader from "@/components/Lead/LeadTableHeader";
import LeadsTableRow from "@/components/Lead/LeadTableRow";

const LeadsDashboard = () => {
  const axios = useAxios();
  const currentRoute = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);
  const leadsPerPage = 100;

  // State management
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAddLeadsOpen, setIsAddLeadsOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Memoized filtered leads
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (statusFilter) {
      filtered = filtered.filter(
        lead => lead.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        lead => lead.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lead =>
          (lead.name?.toLowerCase() || "").includes(query) ||
          (lead.email?.toLowerCase() || "").includes(query) ||
          (lead.phone?.toLowerCase() || "").includes(query)
      );
    }

    return filtered;
  }, [leads, statusFilter, categoryFilter, searchQuery]);

  // Fetch leads data
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/lead`, {
        params: { page, limit: leadsPerPage },
      });

      if (response.status === 304) {
        setLeads([]);
      } else if (response.status === 200) {
        const { data } = response.data;
        setHasMore(data.length === leadsPerPage);
        setLeads(data);
      }
    } catch (error) {
      setError("Failed to fetch leads. Please refresh the page.");
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, [page, axios]);

  // Fetch options (categories, statuses)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`/api/settings`);
        if (response.status === 200) {
          const { categories, statuses } = response.data;
          setCategoryOptions(categories);
          setStatusOptions(statuses);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, [axios]);

  // Initial fetch on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchLeads();
      hasFetchedRef.current = true;
    }
  }, [fetchLeads]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [hasMore, loading]);

  // Handler functions
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLeads(e.target.checked ? filteredLeads.map(lead => lead.id) : []);
  }, [filteredLeads]);

  const handleSelectLead = useCallback((id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleBulkAction = useCallback(async (action: string, value: string) => {
    if (!value || selectedLeads.length === 0) return;

    try {
      setLoading(true);
      const payload = { id: selectedLeads, [action]: value };
      
      const response = await axios.put(`/api/lead/bulk-update`, payload);

      if (response.status === 200) {
        await fetchLeads();
        setSelectedLeads([]);
      }
    } catch (error) {
      setError(`Failed to update lead ${action}. Please try again.`);
      console.error(`Error updating leads ${action}:`, error);
    } finally {
      setLoading(false);
    }
  }, [selectedLeads, axios, fetchLeads]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedLeads.length === 0) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/lead/bulk-delete`, {
        data: { id: selectedLeads },
      });

      if (response.status === 200) {
        await fetchLeads();
        setSelectedLeads([]);
      }
    } catch (error) {
      setError("Failed to delete leads. Please try again.");
      console.error("Error deleting leads:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLeads, axios, fetchLeads]);

  interface FormData {
  type: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  notes: string;
  importCategory: string;
}

  const handleAddLeads = useCallback(async (formData: FormData, file: File | null) => {
    try {
      setLoading(true);
      
      if (formData.type === "manual") {
        const response = await axios.post(`/api/lead`, formData);
        if (response.status === 200) {
          await fetchLeads();
          setIsAddLeadsOpen(false);
        }
      }

      if (formData.type === "import" && file) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("file", file);
        const extension = file.name.split(".").pop();
        if (extension && formData.importCategory) {
          formDataWithFile.append("extension", extension);
          formDataWithFile.append("category", formData.importCategory);
        }

        const response = await axios.post(
          `/api/lead/bulk-import`,
          formDataWithFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          await fetchLeads();
          setIsAddLeadsOpen(false);
        }
      }
    } catch (error) {
      setError("Failed to add leads. Please try again.");
      console.error("Error adding leads:", error);
    } finally {
      setLoading(false);
    }
  }, [axios, fetchLeads]);

  return (
    <div className="fadeIn">
      {currentRoute === "/lead" && <Header />}
      <div className="flex min-h-screen pb-8 overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 overflow-auto py-4 px-4 md:px-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}

            <ProgressionCards leads={leads} />

            <LeadsControls
              selectedLeads={selectedLeads}
              onAddLeads={() => setIsAddLeadsOpen(true)}
              onBulkAction={handleBulkAction}
              onBulkDelete={handleBulkDelete}
              statusOptions={statusOptions}
              categoryOptions={categoryOptions}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              searchQuery={searchQuery}
              onStatusFilterChange={setStatusFilter}
              onCategoryFilterChange={setCategoryFilter}
              onSearchQueryChange={setSearchQuery}
            />

            <div
              className="overflow-x-auto bg-white rounded-lg border shadow-sm max-h-[65vh] border-gray-200"
              ref={listRef}
              onScroll={handleScroll}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <LeadsTableHeader
                  onSelectAll={handleSelectAll}
                  isAllSelected={
                    selectedLeads.length > 0 &&
                    selectedLeads.length === filteredLeads.length
                  }
                />
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading && filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-500">
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <LeadsTableRow
                        key={lead.id}
                        lead={lead}
                        isSelected={selectedLeads.includes(lead.id)}
                        onSelect={handleSelectLead}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddLeadsPopup
        isOpen={isAddLeadsOpen}
        onClose={() => setIsAddLeadsOpen(false)}
        onSubmit={handleAddLeads}
        category={categoryOptions}
      />
    </div>
  );
};

export default LeadsDashboard;