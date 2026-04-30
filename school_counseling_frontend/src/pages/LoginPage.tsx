import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/auth.api";
import { getToken, setToken } from "../features/auth/auth.store";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const data = await login(username, password);

      setToken(data.access);
      navigate("/", {replace: true});
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}