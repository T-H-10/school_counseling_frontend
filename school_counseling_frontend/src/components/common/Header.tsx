// src/components/common/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { getUsername, clearToken } from "../../features/auth/auth.store";

export default function Header() {
  const navigate = useNavigate();
  const username = getUsername();

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #e5e4e7" }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">לוח בקרה</Link>
        <Link to="/students">תלמידים</Link>
        <Link to="/calendar">לוח שנה</Link>
      </nav>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>{username ?? "משתמש"}</span>
        <button onClick={handleLogout}>יציאה</button>
      </div>
    </header>
  );
}