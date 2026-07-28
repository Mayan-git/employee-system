import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./components/layout/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import AddEmployeePage from "./pages/AddEmployeePage.jsx";
import AIInsightsPage from "./pages/AIInsightsPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/employees/new" element={<AddEmployeePage />} />
            <Route path="/team" element={<TeamPage />} />
          </Route>
          <Route path="/ai-insights" element={<AIInsightsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
