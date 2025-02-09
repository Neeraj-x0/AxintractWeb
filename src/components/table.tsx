import React, { useRef, useMemo } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  category: string;
  notes?: string;
  lastContacted?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: string[];
  filteredLeads: Lead[];
  searchQuery?: string;
  onSelectAll: (selected: boolean) => void;
  onSelectLead: (id: string) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  selectedLeads,
  filteredLeads,

  onSelectAll,
  onSelectLead,
  onScroll,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Memoize selection state calculations
  const selectionState = useMemo(() => {
    const visibleLeadIds = new Set(filteredLeads.map((lead) => lead.id));
    const selectedVisibleLeads = selectedLeads.filter((id) =>
      visibleLeadIds.has(id)
    );

    return {
      // All visible leads are selected
      allSelected:
        filteredLeads.length > 0 &&
        selectedVisibleLeads.length === filteredLeads.length,
      // Some visible leads are selected
      partiallySelected:
        selectedVisibleLeads.length > 0 &&
        selectedVisibleLeads.length < filteredLeads.length,
      // Count of selected visible leads
      selectedCount: selectedVisibleLeads.length,
    };
  }, [filteredLeads, selectedLeads]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(event.target.checked);
  };

  const tableHeaders = [
    {
      id: "select",
      label: "",
      hidden: false,
      render: () => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectionState.allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = selectionState.partiallySelected;
              }
            }}
            onChange={handleSelectAll}
            className="rounded border-gray-300"
            aria-label={`Select all leads (${selectionState.selectedCount} selected)`}
          />
        </div>
      ),
    },
    { id: "id", label: "ID", hidden: true },
    { id: "name", label: "Lead Name", hidden: false },
    { id: "email", label: "Email", hidden: false },
    { id: "phone", label: "Phone", hidden: false },
    { id: "lastContacted", label: "Last Contacted", hidden: false },
    { id: "status", label: "Status", hidden: false },
    { id: "category", label: "Category", hidden: false },
    { id: "notes", label: "Notes", hidden: false },
    { id: "action", label: "Action", hidden: false },
  ];

  return (
    <div
      ref={tableRef}
      onScroll={onScroll}
      className="overflow-x-auto bg-white rounded-lg border max-h-[65vh] border-gray-200"
      role="region"
      aria-label={`Leads table (${selectionState.selectedCount} selected)`}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header.id}
                hidden={header.hidden}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                {header.id === "select" ? header.render?.() : header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLeads.map((lead) => (
            <tr
              key={lead.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onSelectLead(lead.id)}
                    className="rounded border-gray-300"
                    aria-label={`Select ${lead.name}`}
                  />
                </div>
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
                {lead.lastContacted || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.notes || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/lead/${lead.phone}`}
                  className="text-indigo-600 hover:text-indigo-900"
                  aria-label={`View details for ${lead.name}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
