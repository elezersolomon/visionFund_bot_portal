import React, { useState } from 'react';

// Placeholder data - replace with API data later
const districtOptions = [
  'Addis Ababa',
  'Amhara',
  'Oromia',
  'SNNPR',
  'Tigray'
];

const branchOptions = {
  'Addis Ababa': ['Bole', 'Kirkos', 'Yeka', 'Arada'],
  'Amhara': ['Bahir Dar', 'Gondar', 'Dessie', 'Debre Markos'],
  'Oromia': ['Adama', 'Jimma', 'Nekemte', 'Bishoftu'],
  'SNNPR': ['Hawassa', 'Arbaminch', 'Dilla', 'Wolayita Sodo'],
  'Tigray': ['Mekelle', 'Adigrat', 'Axum', 'Shire']
};

const ReportFilters = ({ reportType, onFilterChange }) => {
  const [formState, setFormState] = useState({});
  const [availableBranches, setAvailableBranches] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formState, [name]: value };
    
    // Update available branches when district changes
    if (name === 'district') {
      setAvailableBranches(branchOptions[value] || []);
      updated.branch = ''; // Reset branch when district changes
    }
    
    setFormState(updated);
    onFilterChange(updated);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input type="date" name="fromDate" onChange={handleChange} className="border p-2 rounded" />
      <input type="date" name="toDate" onChange={handleChange} className="border p-2 rounded" />
      {(reportType === 'customer' || reportType === 'user') && (
        <>
          <select 
            name="district" 
            value={formState.district || ''} 
            onChange={handleChange} 
            className="border p-2 rounded"
          >
            <option value="">Select District</option>
            {districtOptions.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <select 
            name="branch" 
            value={formState.branch || ''} 
            onChange={handleChange} 
            className="border p-2 rounded"
            disabled={!formState.district}
          >
            <option value="">Select Branch</option>
            {availableBranches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
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
