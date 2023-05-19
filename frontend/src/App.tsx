import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./app/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};
export { App };
