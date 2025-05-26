import React, { useState } from 'react';

const ReportFilters = ({ reportType, onFilterChange }) => {
  const [formState, setFormState] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formState, [name]: value };
    setFormState(updated);
    onFilterChange(updated);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input type="date" name="fromDate" onChange={handleChange} className="border p-2 rounded" />
      <input type="date" name="toDate" onChange={handleChange} className="border p-2 rounded" />
      {(reportType === 'customer' || reportType === 'user') && (
        <>
          <input type="text" name="district" onChange={handleChange} placeholder="District" className="border p-2 rounded" />
          <input type="text" name="branch" onChange={handleChange} placeholder="Branch" className="border p-2 rounded" />
          <input type="text" name="phone" onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
          <input type="text" name="name" onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
        </>
      )}
      {(reportType === 'customer' || reportType === 'user') && (
        <select name="status" onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Status</option>
          {reportType === 'customer' && (
            <>
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="contacted">Contacted</option>
            </>
          )}
          {reportType === 'user' && (
            <>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </>
          )}
        </select>
      )}
    </div>
  );
};

export default ReportFilters;
