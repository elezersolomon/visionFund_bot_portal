import React, { useState } from 'react';

const ReportTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map(key => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="border p-2 cursor-pointer hover:bg-gray-100"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="odd:bg-gray-100">
              {Object.values(item).map((val, i) => (
                <td key={i} className="border p-2">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default ReportTable;
