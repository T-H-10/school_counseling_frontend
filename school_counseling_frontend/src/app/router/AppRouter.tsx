import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Dashboard</div>} />
            </Routes>
        </BrowserRouter>
    )
}