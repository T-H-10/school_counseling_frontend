import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  deleteStudent,
  createStudent,
  updateStudent,
} from "../features/students/students.api";

import StudentForm from "../features/students/StudentForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
  
  const [formErrors, setFormErrors] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createStudent,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateStudent(id, data),
  });


  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Students</h1>

      <StudentForm
        initialData={editingStudent}
        onSubmit={(data) => {
            setFormErrors(null);

            if (editingStudent) {
                updateMutation.mutate(
                    { id: editingStudent.id, data},
                    {
                        onSuccess: () => {
                            setEditingStudent(null);
                            queryClient.invalidateQueries({queryKey: ["students"]});
                        },
                        onError: (err: any) => {
                            setFormErrors(err.response?.data);
                        },
                    }
                );
            }
            else {
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
            }
        }}
        loading={createMutation.isPending || updateMutation.isPending}
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
                <button onClick={() => setEditingStudent(s)}>
                    Edit
                </button>
              <button onClick={() => navigate(`/students/${s.id}`)}>
                פתח
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingStudent && (
        <div style={{ background: "#eef", padding: 10 }}>
            ✏️ עריכה של: {editingStudent.full_name}
            <button onClick={() => setEditingStudent(null)}>
            ביטול
            </button>
        </div>
        )}
    </div>
  );
}