import { httpClient } from "../../api/httpClient";

export const login = async (username: string, password: string) => {
  const res = await httpClient.post("/token/", {
    username,
    password,
  });

  return res.data;
};