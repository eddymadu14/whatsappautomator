import React from "react";

/**
 * LeadTable component
 * @param {Array} leads - array of lead objects
 * Expected lead object structure: { id, name, email, phone, status }
 */
export default function LeadTable({ leads }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left">#</th>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Email</th>
            <th className="px-4 py-2 border-b text-left">Phone</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead.id || index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{lead.name}</td>
              <td className="px-4 py-2 border-b">{lead.email}</td>
              <td className="px-4 py-2 border-b">{lead.phone}</td>
              <td className="px-4 py-2 border-b">{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}