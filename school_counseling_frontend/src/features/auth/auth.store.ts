export const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };
  
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const clearToken = () => {
    localStorage.removeItem("token");
  };

  export const getUsername = (): string | null => {
    const token = getToken();
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.username || payload.user?.username || payload.email || null;
    } catch {
      return null;
    }
  };