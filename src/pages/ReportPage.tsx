import React, { useState } from "react";
import ReportFilters from "../components/Report/ReportFilters";
import ReportTable from "../components/Report/ReportTable";
import {
  getCustomerReports,
  getUserReports,
  getLeadReports,
} from "../services/api";
import { Box, CircularProgress, Typography } from "@mui/material";

interface ReportItem {
  name: string;
  phone: string;
  status: string;
  district: string;
  branch: string;
  date: string;
}

interface Filters {
  fromDate?: string;
  toDate?: string;
  district?: string;
  branch?: string;
  status?: string;
}

type ReportType = "customer" | "user" | "lead";

const ReportPage = () => {
  const [reportType, setReportType] = useState<ReportType>("customer");
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      let response: ReportItem[];

      // Only send relevant filters based on report type
      const filterParams = {
        ...filters,
        // For lead reports, only include date filters
        ...(reportType === "lead" && {
          district: undefined,
          branch: undefined,
          status: undefined,
        }),
      };

      switch (reportType) {
        case "customer":
          // send the request only if there are from and to dates
          if (!filters.fromDate || !filters.toDate) {
            setError("Please select both From Date and To Date.");
            setLoading(false);
            return;
          }
          response = await getCustomerReports(filterParams);
          break;
        case "user":
          // send the request only if there are from and to dates
          if (!filters.fromDate || !filters.toDate) {
            setError("Please select both From Date and To Date.");
            setLoading(false);
            return;
          }
          response = await getUserReports(filterParams);
          break;
        case "lead":
          // send the request only if there are from and to dates
          if (!filters.fromDate || !filters.toDate) {
            setError("Please select both From Date and To Date.");
            setLoading(false);
            return;
          }
          response = await getLeadReports({
            fromDate: filters.fromDate,
            toDate: filters.toDate,
          });
          break;
        default:
          return;
      }

      setData(response);
    } catch (err) {
      setError("Failed to fetch reports. Please try again.");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Report Type:
        </label>
        <select
        
          value={reportType}
          onChange={(e) => {
            setReportType(e.target.value as ReportType);
            setData([]); // Clear existing data when report type changes
            setFilters({}); // Reset filters when report type changes
          }}
          className="shadow border rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="customer">Customer Registration</option>
          <option value="user">User Report</option>
          <option value="lead">Lead Report</option>
        </select>
      </div>
      <ReportFilters reportType={reportType} onFilterChange={setFilters} />

      <div className="my-4">
        <button
          onClick={fetchReports}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? (
            <CircularProgress />
          ) : filters.fromDate && filters.toDate ? (
            "View Report"
          ) : (
            "View Report"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {data.length > 0 ? (
        <ReportTable data={data} />
      ) : (
        !loading && (
          <div className="text-center text-gray-600">
            No data available. Click "Fetch Reports" to load data.
          </div>
        )
      )}
    </div>
  );
};

export default ReportPage;
