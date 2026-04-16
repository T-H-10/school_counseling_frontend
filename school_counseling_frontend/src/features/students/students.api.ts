import { httpClient } from "../../api/httpClient";
import type { Student } from "./student.types";

export const getStudents = async (): Promise<Student[]> => {
  const res = await httpClient.get("/students/");
  return res.data;
};

export const deleteStudent = async (id: number) => {
  await httpClient.delete(`/students/${id}/`);
};

export const createStudent = async (data: Partial<Student>) => {
  const res = await httpClient.post("/students/", data);
  return res.data;
};

export const updateStudent = async (id: number, data: any) => {
    const res = await httpClient.put(`/students/${id}/`, data);
    return res.data;
  };