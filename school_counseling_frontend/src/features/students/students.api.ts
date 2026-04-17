import { httpClient } from "../../api/httpClient";
import type { Student } from "./student.types";

export const getStudents = async (params: {
    page?: number;
    search?: string;
    ordering?: string;
  }) => {
    const res = await httpClient.get("/students/", {
      params: {
        ...(params.page ? { page: params.page } : {}),
        ...(params.search ? { search: params.search } : {}),
        ...(params.ordering ? { ordering: params.ordering } : {}),
      },
    });
  
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

export const getStudent = async (id: number) => {
    const res = await httpClient.get(`/students/${id}/`);
    return res.data;
};

export const getStudentEvents = async (id: number) => {
    const res = await httpClient.get(`/studentEvents/?student=${id}`);
    return res.data;
  };
  
  export const getStudentEnrollments = async (id: number) => {
    const res = await httpClient.get(`/enrollments/?student=${id}`);
    return res.data;
  };
  
  export const getStudentSessions = async (id: number) => {
    const res = await httpClient.get(`/classSessions/?student=${id}`);
    return res.data;
  };