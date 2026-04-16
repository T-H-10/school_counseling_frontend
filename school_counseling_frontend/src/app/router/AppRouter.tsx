import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import StudentsPage from "../../pages/studentsPage";
import StudentDetailsPage from "../../pages/StudentDetailsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Dashboard</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/students/:id" element={<StudentDetailsPage />} />
            </Routes>
        </BrowserRouter>
    )
}