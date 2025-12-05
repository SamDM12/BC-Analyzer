import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

import Upload from "./pages/Upload";
import DataView from "./pages/DataView";
import Metrics from "./pages/Metrics";
import Report from "./pages/Report";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireRole } from "@/components/auth/RequireRole";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className="min-h-screen w-full">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ---- Rutas protegidas ---- */}

        <Route
          path="/upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />

        <Route
          path="/data-view"
          element={
            <RequireAuth>
              <RequireRole roles={["EJECUTIVO", "GERENCIA"]}>
                <DataView />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/metrics"
          element={
            <RequireAuth>
              <RequireRole roles={["GERENCIA"]}>
                <Metrics />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/report"
          element={
            <RequireAuth>
              <Report />
            </RequireAuth>
          }
        />

        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;