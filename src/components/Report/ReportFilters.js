import React, { useEffect, useState } from 'react';
import { getAreas, getBranches } from '../../services/api';
import { useSelector } from 'react-redux';

const ReportFilters = ({ reportType, onFilterChange }) => {
  const userBranch = useSelector((state) => state?.user?.branchID);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [userBranchDetails, setUserBranchDetails] = useState(null);
  
  const [formState, setFormState] = useState({
    fromDate: '',
    toDate: '',
    district: '',
    branch: '',
    status: ''
  });

  // Reset form state when report type changes, but maintain district if user is not from head office
  useEffect(() => {
    setFormState(prev => {
      const resetState = {
        fromDate: '',
        toDate: '',
        district: '',
        branch: '',
        status: ''
      };

      // If user is not from head office, maintain their district
      if (userBranchDetails && userBranchDetails.areaid !== 1) {
        resetState.district = userBranchDetails.areaid.toString();
      }

      return resetState;
    });
    onFilterChange({}); // Reset filters in parent component
  }, [reportType, userBranchDetails]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const areas = await getAreas();
        const branches = await getBranches();
        setDistrictOptions(areas);
        setBranchOptions(branches);

        // Find user's branch details
        if (userBranch) {
          const userBranchInfo = branches.find(branch => branch.id === userBranch);
          setUserBranchDetails(userBranchInfo);
          
          // If user's branch is not head office (district ID 1), set and disable district
          if (userBranchInfo && userBranchInfo.areaid !== 1) {
            setFormState(prev => ({
              ...prev,
              district: userBranchInfo.areaid.toString()
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [userBranch]);

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

  // Check if user is from head office
  const isHeadOfficeUser = userBranchDetails?.areaid === 1;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">From Date *</label>
          <input
            type="date"
            name="fromDate"
            value={formState.fromDate}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">To Date *</label>
          <input
            type="date"
            name="toDate"
            value={formState.toDate}
            onChange={handleChange}
            required
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
                disabled={!isHeadOfficeUser && userBranchDetails} // Disable if not head office
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
                    <option value="New">New</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                  </>
                )}
                {reportType === 'user' && (
                  <>
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
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
