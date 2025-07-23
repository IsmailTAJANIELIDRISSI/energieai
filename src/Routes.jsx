import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DashboardOverview from "pages/dashboard-overview";
import MachineMonitoring from "pages/machine-monitoring";
import EnergyAnalytics from "pages/energy-analytics";
import ReportsExport from "pages/reports-export";
import RecommendationsEngine from "pages/recommendations-engine";
import AlertsNotifications from "pages/alerts-notifications";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/machine-monitoring" element={<MachineMonitoring />} />
        <Route path="/energy-analytics" element={<EnergyAnalytics />} />
        <Route path="/reports-export" element={<ReportsExport />} />
        <Route path="/recommendations-engine" element={<RecommendationsEngine />} />
        <Route path="/alerts-notifications" element={<AlertsNotifications />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;