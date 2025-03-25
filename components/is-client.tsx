"use client";

import { useState, useEffect, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function IsClientComponent({
  children,
}: {
  children: ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    return (
      <div>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    );
  }
}
