import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  deleteStudent,
  createStudent,
} from "../features/students/students.api";

import StudentForm from "../features/students/StudentForm";
import { useState } from "react";

export default function StudentsPage() {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createStudent,
  });

  const [formErrors, setFormErrors] = useState<any>(null);
  
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Students</h1>

      <StudentForm
        onSubmit={(data) => {
            setFormErrors(null);

            createMutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
            },
            onError: (err: any) => {
                if (err.response?.data) {
                setFormErrors(err.response.data);
                }
            },
            });
        }}
        loading={createMutation.isPending}
        errors={formErrors}
    />

      <hr />

      <table border={1}>
        <thead>
          <tr>
            <th>שם</th>
            <th>ת"ז</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {students?.map((s) => (
            <tr key={s.id}>
              <td>{s.full_name}</td>
              <td>{s.id_number}</td>

              <td>
                <button
                  onClick={() => {
                    if (!confirm("Are you sure?")) return;
                    deleteMutation.mutate(s.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}