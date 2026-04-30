import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import StudentsPage from "../../pages/studentsPage";
import StudentDetailsPage from "../../pages/StudentDetailsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute><div>Dashboard</div> </ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/students" element={<ProtectedRoute><StudentsPage /> </ProtectedRoute>} />
                <Route path="/students/:id" element={<ProtectedRoute> <StudentDetailsPage /> </ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}