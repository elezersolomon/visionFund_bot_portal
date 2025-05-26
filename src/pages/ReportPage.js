import React, { useState, useEffect } from 'react';
import ReportFilters from '../components/Report/ReportFilters';
import ReportTable from '../components/Report/ReportTable';
import mockData from '../data/mockData';

const ReportPage = () => {
  const [reportType, setReportType] = useState('customer');
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let data = mockData[reportType];

    if (filters.name) data = data.filter(item => item.name.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.phone) data = data.filter(item => item.phone?.includes(filters.phone));
    if (filters.status) data = data.filter(item => item.status === filters.status);
    if (filters.district) data = data.filter(item => item.district === filters.district);
    if (filters.branch) data = data.filter(item => item.branch === filters.branch);
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      data = data.filter(item => {
        const date = new Date(item.date);
        return date >= from && date <= to;
      });
    }

    setFilteredData(data);
  }, [filters, reportType]);

  return (
    <div>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Report Type:</label>
        <select value={reportType} onChange={e => setReportType(e.target.value)} className="border p-1 rounded">
          <option value="customer">Customer Registration</option>
          <option value="user">User Report</option>
          <option value="lead">Lead Report</option>
        </select>
      </div>
      <ReportFilters reportType={reportType} onFilterChange={setFilters} />
      <ReportTable data={filteredData} />
    </div>
  );
};

export default ReportPage;
