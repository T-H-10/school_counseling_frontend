// src/api/events.api.ts
import { httpClient } from "./httpClient";

export const getEvents = async () => {
  const res = await httpClient.get("/studentEvents/");
  return res.data;
};