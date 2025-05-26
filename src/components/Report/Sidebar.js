import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white p-4">
    <h2 className="text-xl font-bold mb-6">Reports</h2>
    <ul>
      <li>
        <Link to="/reports" className="block py-2 hover:bg-gray-700 rounded px-2">Report</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
