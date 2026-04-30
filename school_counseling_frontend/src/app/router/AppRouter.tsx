import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import StudentsPage from "../../pages/studentsPage";
import StudentDetailsPage from "../../pages/StudentDetailsPage";
import ProtectedRoute from "./ProtectedRoute";
import Header from "../../components/common/Header";
import CalendarPage from "../../pages/CalendarPage";
import DashboardPage from "../../pages/DashboardPage";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StudentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StudentDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CalendarPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}