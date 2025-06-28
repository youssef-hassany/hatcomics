"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "oklch(27.4% 0.006 286.033)",
            color: "oklch(64.6% 0.222 41.116)",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
