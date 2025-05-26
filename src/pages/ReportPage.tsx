import React, { useState, useEffect } from "react";
import ReportFilters from "../components/Report/ReportFilters";
import ReportTable from "../components/Report/ReportTable";
import mockData from "../data/mockData";

interface ReportItem {
  name: string;
  phone: string;
  status: string;
  district: string;
  branch: string;
  date: string;
}

interface Filters {
  name?: string;
  phone?: string;
  status?: string;
  district?: string;
  branch?: string;
  fromDate?: string;
  toDate?: string;
}

type ReportType = "customer" | "user" | "lead";

type MockDataType = {
  [K in ReportType]: ReportItem[];
};

const ReportPage = () => {
  const [reportType, setReportType] = useState<ReportType>("customer");
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<ReportItem[]>([]);

  useEffect(() => {
    const typedMockData = mockData as MockDataType;
    let data = typedMockData[reportType];

    if (typeof filters.name === "string") {
      data = data.filter((item: ReportItem) =>
        item.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (typeof filters.phone === "string") {
      data = data.filter((item: ReportItem) =>
        item.phone?.includes(filters.phone!)
      );
    }

    if (typeof filters.status === "string") {
      data = data.filter((item: ReportItem) => item.status === filters.status);
    }

    if (typeof filters.district === "string") {
      data = data.filter(
        (item: ReportItem) => item.district === filters.district
      );
    }

    if (typeof filters.branch === "string") {
      data = data.filter((item: ReportItem) => item.branch === filters.branch);
    }

    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      data = data.filter((item: ReportItem) => {
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
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          className="border p-1 rounded"
        >
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
