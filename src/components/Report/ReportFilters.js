import React, { useEffect, useState } from 'react';
import { getAreas, getBranches } from '../../services/api';

const ReportFilters = ({ reportType, onFilterChange }) => {
  const [districtOptions, setDistrictOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [formState, setFormState] = useState({
    fromDate: '',
    toDate: '',
    district: '',
    branch: '',
    status: ''
  });

  // Reset form state when report type changes
  useEffect(() => {
    setFormState({
      fromDate: '',
      toDate: '',
      district: '',
      branch: '',
      status: ''
    });
    onFilterChange({}); // Reset filters in parent component
  }, [reportType]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const areas = await getAreas();
        const branches = await getBranches();
        setDistrictOptions(areas);
        setBranchOptions(branches);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formState, [name]: value };

    // Update available branches when district changes
    if (name === 'district') {
      updated.branch = ''; // Reset branch when district changes
    }

    setFormState(updated);
    onFilterChange(updated); // Send the updated filters to parent
  };

  // Get filtered branches based on selected district
  const getFilteredBranches = () => {
    if (!formState.district) return [];
    return branchOptions.filter(branch => branch.areaid === parseInt(formState.district));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formState.fromDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">To Date</label>
          <input
            type="date"
            name="toDate"
            value={formState.toDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {(reportType === 'customer' || reportType === 'user') && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
              <select
                name="district"
                value={formState.district}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select District</option>
                {districtOptions?.map(district => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Branch</label>
              <select
                name="branch"
                value={formState.branch}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!formState.district}
              >
                <option value="">Select Branch</option>
                {getFilteredBranches().map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                name="status"
                value={formState.status}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
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
                    <option value="new">Active</option>
                    <option value="inprogress">Inactive</option>
                    <option value="contacted">Suspended</option>
                  </>
                )}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
