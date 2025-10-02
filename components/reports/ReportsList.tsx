"use client";

import Link from "next/link";
import {
  useReports,
  useDeleteReport,
  useDeleteAllReports,
} from "@/hooks/reports/reports";
import { CircleAlert } from "lucide-react";

export default function ReportsList() {
  const { data: reports, isLoading } = useReports();
  const deleteReport = useDeleteReport();
  const deleteAllReports = useDeleteAllReports();

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all reports?")) {
      deleteAllReports.mutate();
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8 pt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Reports</h1>
          {reports && reports.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deleteAllReports.isPending}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleteAllReports.isPending ? "Deleting..." : "Delete All"}
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-400 mt-4">Loading reports...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && reports && reports.length === 0 && (
          <div className="text-center py-12 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-400 text-lg">No reports found</p>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && reports && reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={report.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-zinc-800 rounded-lg p-5 border border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-800/80 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <CircleAlert className="text-orange-700" />

                    {report.description && (
                      <p className="text-zinc-300 text-sm line-clamp-2">
                        {report.description}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, report.id)}
                    disabled={deleteReport.isPending}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-red-900/20 text-zinc-400 hover:text-red-400 rounded-md transition-all disabled:opacity-50 flex-shrink-0 text-sm border border-zinc-700 hover:border-red-500/30 cursor-pointer"
                  >
                    {deleteReport.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
