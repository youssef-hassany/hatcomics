import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface Report {
  id: string;
  referenceUrl: string;
  description: string | null;
  createdAt: Date;
}

interface CreateReportInput {
  referenceUrl: string;
  description?: string;
}

// Query Keys
export const reportKeys = {
  all: ["reports"] as const,
  detail: (id: string) => ["reports", id] as const,
};

// Get all reports
export function useReports() {
  return useQuery({
    queryKey: reportKeys.all,
    queryFn: async (): Promise<Report[]> => {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });
}

// Create a report
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReportInput): Promise<Report> => {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

// Delete a specific report
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete report");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

// Delete all reports
export function useDeleteAllReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const res = await fetch("/api/reports", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete all reports");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}
