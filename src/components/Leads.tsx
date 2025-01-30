import React, { useState, useEffect } from "react";
import leads from "./lead";

const LeadsDashboard = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="layout-content-container flex flex-col flex-1 p-6 bg-white  overflow-hidden max-h-[85vh] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-[#202020]">Manage your leads</h1>
      <p className="text-[#7E909A] mt-2 mb-6">
        Track and manage your leads, from first touch to close.
      </p>

      {loading ? (
        <div className="mt-6 bg-[#F1F1F1] p-4 rounded-lg animate-pulse">
          <div className="h-6 bg-[#E0E0E0] rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-[#E0E0E0] rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-[#E0E0E0] rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="mt-4 flex space-x-4">
            <input
              type="text"
              placeholder="Search for a lead by name, email, or phone number"
              className="w-full p-3 bg-white border border-[#D1D8DC] rounded-md text-[#202020] focus:outline-none focus:ring-2 focus:ring-[#1C4E80] transition duration-200 ease-in-out"
            />
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              className="px-6 py-3 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: "#1C4E80" }}
            >
              Create a new lead
            </button>
            <button
              className="px-6 py-3 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: "#EA6A47" }}
            >
              Import leads
            </button>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border overflow-scroll max-h-[60vh] border-[#E4E4E4]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#A5D8DD]">
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Name</th>
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Email</th>
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Phone</th>
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Last Contacted</th>
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Lead Score</th>
                    <th className="p-3 text-[#202020] font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#E4E4E4] hover:bg-[#F9F9F9] transition-all duration-200"
                    >
                      <td className="p-4 text-[#202020]">{lead.name}</td>
                      <td className="p-4 text-[#202020]">{lead.email}</td>
                      <td className="p-4 text-[#202020]">{lead.phone}</td>
                      <td className="p-4 text-[#202020]">{lead.lastContacted}</td>
                      <td className="p-4">
                        <div className="w-24 bg-[#E4E4E4] rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${lead.leadScore}%`,
                              backgroundColor: "#1C4E80",
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-[#202020]">{lead.leadScore}</span>
                      </td>
                      <td className="p-4 text-[#0091D5] cursor-pointer font-medium hover:text-[#005A8D] transition-all duration-200">
                        {lead.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsDashboard;
