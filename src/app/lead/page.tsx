/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import AddLeadsPopup from "@/components/PopUp/addLeadPopup";
import useAxios from "@/lib";

interface Lead {
  notes: string;
  category: string;
  id: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  lastContacted?: string;
}

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

  // Memoized progression stages for performance
  const progressionStages = useMemo(() => [
    {
      title: "New",
      description: "Leads that have been recently created",
      count: leads.filter(lead => lead.status === "New").length,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "🆕",
    },
    {
      title: "Engaged",
      description: "Leads that have interacted with your content",
      count: leads.filter(lead => lead.status === "Engaged").length,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "⭐",
    },
    {
      title: "Qualified",
      description: "Leads that have been identified as potential customers",
      count: leads.filter(lead => lead.status === "Qualified").length,
      color: "bg-green-50 text-green-700 border-green-100",
      icon: "✅",
    },
  ], [leads]);

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

  // Handlers
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

  const handleAddLeads = useCallback(async (formData: any, file: File | null) => {
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
        if (extension) {
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
      <div className="flex h-screen pb-8 overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto py-4 px-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}

            {/* Progression Cards */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {progressionStages.map((stage, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${stage.color} hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{stage.icon}</span>
                        <h3 className="font-medium">{stage.title}</h3>
                      </div>
                      <span className="text-2xl font-semibold">{stage.count}</span>
                    </div>
                    <p className="text-sm opacity-75">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls and Table */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsAddLeadsOpen(true)}
                    className="px-3 py-1 bg-indigo-600 text-sm text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Leads
                  </button>

                  {/* Bulk Actions */}
                  {selectedLeads.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        onChange={(e) => handleBulkAction('status', e.target.value)}
                        className="px-2 py-1 text-sm border rounded-md"
                      >
                        <option value="">Change Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <select
                        onChange={(e) => handleBulkAction('category', e.target.value)}
                        className="px-2 py-1 text-sm border rounded-md"
                      >
                        <option value="">Change Category</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleBulkDelete}
                        className="px-2 py-1 bg-red-600 text-sm text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1 text-sm border rounded-md"
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2 py-1 text-sm border rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="px-3 py-1 border rounded-md flex-grow sm:w-48 lg:w-64"
                    placeholder="Search by Name, Email, or Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div
                className="overflow-x-auto bg-white rounded-lg border shadow-sm max-h-[65vh] border-gray-200"
                ref={listRef}
                onScroll={handleScroll}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedLeads.length > 0 && 
                            selectedLeads.length === filteredLeads.length
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Lead Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Last Contacted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Notes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
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
                        <tr
                          key={lead.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => handleSelectLead(lead.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.phone}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.lastContacted || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${lead.status === 'New' ? 'bg-blue-50 text-blue-700' : 
                                lead.status === 'Engaged' ? 'bg-purple-50 text-purple-700' : 
                                lead.status === 'Qualified' ? 'bg-green-50 text-green-700' : 
                                'bg-gray-50 text-gray-700'}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.category}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                            {lead.notes}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <Link
                              href={`/lead/${lead.id}`}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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