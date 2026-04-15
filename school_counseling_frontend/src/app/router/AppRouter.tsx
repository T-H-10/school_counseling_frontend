import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<div>Dashboard</div>} />
            </Routes>
        </BrowserRouter>
    )
}