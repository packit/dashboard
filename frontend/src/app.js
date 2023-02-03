import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./components/app_layout";
import { AppRoutes } from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => {
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <AppLayout>
                    <AppRoutes />
                </AppLayout>
            </QueryClientProvider>
        </Router>
    );
};
export default App;
