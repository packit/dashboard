import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./components/app_layout";
import { AppRoutes } from "./routes";

const App = () => {
    return (
        <Router>
            <AppLayout>
                <AppRoutes />
            </AppLayout>
        </Router>
    );
};
export default App;