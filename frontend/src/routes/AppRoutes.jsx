import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import DataMarketplace from "../components/DataMarketplace";
import Dashboard from "../components/Dashboard";
import { VerificationPanel } from "../components/VerificationPanel";
import { RoleManager } from '../components/RoleManager';
import { AdminTemplateManager } from '../components/CreateTemplate';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<DataMarketplace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="verification-panel" element={<VerificationPanel />} />
          <Route path="role-manager" element={<RoleManager />} />
          <Route path="template" element={<AdminTemplateManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
