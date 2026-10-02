import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth, RequireAdmin } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AircraftPage from "./pages/AircraftPage";
import MaintenancePage from "./pages/MaintenancePage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import FlightStatusPage from "./pages/FlightStatusPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Standard Protected Layout (User & Admin access)
const ProtectedLayout = () => (
  <RequireAuth>
    <DashboardLayout />
  </RequireAuth>
);

// Admin-Only Layout (Exclusive to Administrator)
const AdminLayout = () => (
  <RequireAdmin>
    <DashboardLayout />
  </RequireAdmin>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Authentication */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin-login" element={<LoginPage />} />

              {/* Shared User & Admin Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/flight-status" element={<FlightStatusPage />} />
                <Route path="/aircraft" element={<AircraftPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/team" element={<FlightStatusPage />} />
              </Route>

              {/* Admin-Only Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
