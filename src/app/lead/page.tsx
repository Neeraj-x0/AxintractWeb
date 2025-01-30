"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { debounce } from "lodash"; // Use lodash to debounce the search function
import { usePathname } from "next/navigation";

const LeadsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [hasMore, setHasMore] = useState(true); // Track if more leads need to be loaded
  const [page, setPage] = useState(1); // Page number for pagination

  const leadsPerPage = 100; // Number of leads per request
  const listRef = useRef(null); // For tracking scroll position

  interface Lead {
    gender: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }

  const progressionStages = [
    {
      title: "New",
      description: "Leads that have been recently created",
      count: 45,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "🆕",
    },
    {
      title: "Engaged",
      description: "Leads that have interacted with your content",
      count: 32,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "⭐",
    },
    {
      title: "Qualified",
      description: "Leads that have been identified as potential customers",
      count: 28,
      color: "bg-green-50 text-green-700 border-green-100",
      icon: "✅",
    },
  ];

  // Fetch leads from the API with pagination
  const fetchLeads = useCallback(async (page: number) => {
    setLoading(true);
    const response = await fetch(
      `https://dummyjson.com/users?page=${page}&limit=${leadsPerPage}`
    );
    const data = await response.json();
    if (data.users.length < leadsPerPage) setHasMore(false); // No more data

    setLeads((prevLeads) => [...prevLeads, ...data.users]); // Append new leads to the previous ones
    setLoading(false);
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    fetchLeads(page);
  }, [page, fetchLeads]);

  // Handle search query with debouncing
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = leads.filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(lowerCaseQuery) ||
        lead.lastName.toLowerCase().includes(lowerCaseQuery) ||
        lead.email.toLowerCase().includes(lowerCaseQuery) ||
        lead.phone.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredLeads(filtered);
  }, 500); // Delay search input by 500ms to avoid excessive calls

  // Handle scroll event for infinite scrolling
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

  //get current route
  const currentRoute = usePathname();

  return (
    <div className="fadeIn">
      {currentRoute === "/lead" && <Header />}
      <div className="flex h-screen pb-8 overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto py-4 px-8">
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

            {/* Leads Table */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Leads
                </h2>
                {/* Search Section */}
                <input
                  type="text"
                  className="px-4 py-2 border rounded-md w-1/3"
                  placeholder="Search by Name, Email, or Phone"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {loading && page === 1 ? (
                <div className="mt-6 bg-[#F1F1F1] p-4 rounded-lg animate-pulse">
                  <div className="h-6 bg-[#E0E0E0] rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-[#E0E0E0] rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-[#E0E0E0] rounded w-3/4"></div>
                </div>
              ) : (
                <div
                  className="overflow-x-auto bg-white rounded-lg border max-h-[65vh] border-gray-200"
                  ref={listRef}
                  onScroll={handleScroll}
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.length > 0
                        ? filteredLeads.map((lead) => (
                            <tr
                              key={lead.phone}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
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
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lead.gender}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <Link
                                  href={`/lead/${lead.phone}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))
                        : leads.map((lead) => (
                            <tr
                              key={lead.phone}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
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
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lead.gender}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <button
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => {
                                    location.href = `/lead/${lead.phone}`;
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsDashboard;
