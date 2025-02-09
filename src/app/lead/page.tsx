"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";

import { usePathname } from "next/navigation";
import AddLeadsPopup, {
  AddLeadsPopupProps,
} from "@/components/PopUp/addLeadPopup";
import { API_URL, JWT_TOKEN } from "@/constants";
import axios from "@/lib";

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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAddLeadsOpen, setIsAddLeadsOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const leadsPerPage = 100;
  const listRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`/api/settings`, {});
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
  }, []);
  const progressionStages = [
    {
      title: "New",
      description: "Leads that have been recently created",
      count: leads.filter((lead) => lead.status === "New").length,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "🆕",
    },
    {
      title: "Engaged",
      description: "Leads that have interacted with your content",
      count: leads.filter((lead) => lead.status === "Engaged").length,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "⭐",
    },
    {
      title: "Qualified",
      description: "Leads that have been identified as potential customers",
      count: leads.filter((lead) => lead.status === "Qualified").length,
      color: "bg-green-50 text-green-700 border-green-100",
      icon: "✅",
    },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentLeadsToShow = searchQuery ? filteredLeads : leads;
      setSelectedLeads(currentLeadsToShow.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((id) => id !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (!newStatus) return;

    try {
      setLoading(true);
      console.log(selectedLeads);
      const response = await axios.put(
        `${API_URL}/api/lead/bulk-update`,
        {
          id: selectedLeads,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${JWT_TOKEN}` },
        }
      );

      if (response.status === 200) {
        await fetchLeads();
        console.log("selectedLeads", leads);
        setFilteredLeads((prev) =>
          prev.filter((lead) => !selectedLeads.includes(lead.id))
        );
        setSelectedLeads([]);
      }
    } catch (error) {
      setError("Failed to update lead status. Please try again.");
      console.error("Error updating leads status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCategoryChange = async (newCategory: string) => {
    if (!newCategory) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/api/lead/bulk-update`,
        {
          id: selectedLeads,
          category: newCategory,
        },
        {
          headers: { Authorization: `Bearer ${JWT_TOKEN}` },
        }
      );

      if (response.status === 200) {
        await fetchLeads();
        console.log("selectedLeads", leads);
        setFilteredLeads((prev) =>
          prev.filter((lead) => !selectedLeads.includes(lead.id))
        );
        setSelectedLeads([]);
      }
    } catch (error) {
      setError("Failed to update lead category. Please try again.");
      console.error("Error updating leads category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    // if (
    //   !window.confirm(
    //     "Are you sure you want to delete these leads? This action cannot be undone."
    //   )
    // ) {
    //   return;
    // }

    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/api/lead/bulk-delete`, {
        data: { id: selectedLeads },
        headers: { Authorization: `Bearer ${JWT_TOKEN}` },
      });

      if (response.status === 200) {
        await fetchLeads();
        setFilteredLeads((prev) =>
          prev.filter((lead) => !selectedLeads.includes(lead.id))
        );
        setSelectedLeads([]);
      }
    } catch (error) {
      setError("Failed to delete leads. Please try again.");
      console.error("Error deleting leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeads: AddLeadsPopupProps["onSubmit"] = async (
    formData,
    file
  ) => {
    try {
      setLoading(true);
      if (formData.type === "manual") {
        const response = await axios.post(`${API_URL}/api/lead`, formData, {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });

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
          `${API_URL}/api/lead/bulk-import`,
          formDataWithFile,
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
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
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/lead`, {
        params: { page, limit: leadsPerPage },
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });

      if (response.status === 304) {
        setLeads([]);
      } else if (response.status === 200) {
        const { data } = response.data;

        if (data.length < leadsPerPage) {
          setHasMore(false);
        }
        setLeads(data);
      }
    } catch (error) {
      setError("Failed to fetch leads. Please refresh the page.");
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const applyFilters = useCallback(() => {
    // Start fresh with the complete dataset
    let filtered = leads;
    try {
      // Apply status filter if present
      if (statusFilter.trim()) {
        filtered = filtered.filter(
          (lead) => lead.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Apply category filter if present
      if (categoryFilter.trim()) {
        filtered = filtered.filter(
          (lead) =>
            lead.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      // Apply search filter if present
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (lead) =>
            (lead.name?.toLowerCase() || "").includes(query) ||
            (lead.email?.toLowerCase() || "").includes(query) ||
            (lead.phone?.toLowerCase() || "").includes(query)
        );
      }

      // Only update if there's actually a change
      setFilteredLeads(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
      // Fallback to showing all leads if filtering fails
      setFilteredLeads(leads);
    }
  }, [leads, statusFilter, categoryFilter, searchQuery]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchLeads();
      hasFetchedRef.current = true;
    }
  }, [fetchLeads]);

  useEffect(() => {
    applyFilters();
  }, [leads, statusFilter, categoryFilter, searchQuery, applyFilters]);

  const currentRoute = usePathname();

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

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Progression
              </h2>
              <div className="grid grid-cols-3 gap-4">
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
                      <span className="text-2xl font-semibold">
                        {stage.count}
                      </span>
                    </div>
                    <p className="text-sm opacity-75">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsAddLeadsOpen(true)}
                    className="px-3 py-1 bg-indigo-600 text-sm text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Leads
                  </button>

                  {/* Bulk Actions */}
                  {selectedLeads.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <select
                        onChange={(e) => handleBulkStatusChange(e.target.value)}
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
                        onChange={(e) =>
                          handleBulkCategoryChange(e.target.value)
                        }
                        className="px-2 py-1 border text-sm rounded-md"
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
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1 text-sm  border rounded-md"
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
                    className="px-2 py-1 text-sm  border rounded-md"
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
                    className="px-4 py-2 border rounded-md w-64"
                    placeholder="Search by Name, Email, or Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div
                className="overflow-x-auto bg-white rounded-lg border max-h-[65vh] border-gray-200"
                ref={listRef}
                onScroll={handleScroll}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedLeads.length ===
                            (searchQuery ? filteredLeads.length : leads.length)
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th
                        hidden
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Lead Name
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Last Contacted
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td
                          hidden
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {lead.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.notes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/lead/${lead.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
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
