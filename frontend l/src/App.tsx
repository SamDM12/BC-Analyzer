import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Navbar } from "@/components/layout/Navbar";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import Upload from "./pages/Upload";
import DataView from "./pages/DataView";
import Metrics from "./pages/Metrics";
import Report from "./pages/Report";
import History from "./pages/History";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import RolePermissions from "./pages/admin/RolePermissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for main dashboard pages
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen w-full">
        <Navbar />
        {children}
      </div>
  );
}

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Protected dashboard routes */}
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route
                  path="/upload"
                  element={
                    <PrivateRoute>
                      <DashboardLayout>
                        <Upload />
                      </DashboardLayout>
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/data-view"
                  element={
                    <PrivateRoute>
                      <DashboardLayout>
                        <DataView />
                      </DashboardLayout>
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/metrics"
                  element={
                    <PrivateRoute>
                      <DashboardLayout>
                        <Metrics />
                      </DashboardLayout>
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/report"
                  element={
                    <PrivateRoute>
                      <DashboardLayout>
                        <Report />
                      </DashboardLayout>
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <DashboardLayout>
                        <History />
                      </DashboardLayout>
                    </PrivateRoute>
                  }
              />

              {/* Admin routes - require ADMIN role */}
              <Route
                  path="/admin"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <AdminLayout />
                    </PrivateRoute>
                  }
              >
                <Route index element={<Navigate to="/admin/users" replace />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="roles/:id/permissions" element={<RolePermissions />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
