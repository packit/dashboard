import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TestQueryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey: [url] }) => {
        if (typeof url !== "string") {
          throw new Error("Invalid QueryKey");
        }
        return fetch(url).then((response) => response.text());
      },
      cacheTime: 0,
    },
  },
});

export const withQueryClient = (Story) => {
  return (
    <QueryClientProvider client={TestQueryClient}>
      <Story />
    </QueryClientProvider>
  );
};
