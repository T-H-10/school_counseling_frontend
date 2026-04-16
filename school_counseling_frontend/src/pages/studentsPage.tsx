import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  deleteStudent,
  createStudent,
  updateStudent,
} from "../features/students/students.api";

import StudentForm from "../features/students/StudentForm";
import Modal from "../components/ui/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"full_name" | "id_number">("full_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const processedStudents = students?.filter((s) => {
    const text = search.toLowerCase();

    return (
      s.full_name.toLowerCase().includes(text) ||
      s.id_number.includes(text)
    );
  })
  .sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateStudent(id, data),
  });

  const openCreate = () => {
    setMode("create");
    setEditingStudent(null);
    setModalOpen(true);
  };

  const openEdit = (student: any) => {
    setMode("edit");
    setEditingStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
    setFormErrors(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Students</h1>

      <button onClick={openCreate}>
        ➕ הוסף תלמיד
      </button>

      <hr />
      <div style={{ marginBottom: 10 }}>
        <input
            placeholder="חיפוש לפי שם או ת״ז..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
        >
            <option value="full_name">מיין לפי שם</option>
            <option value="id_number">מיין לפי ת"ז</option>
        </select>

        <button
            onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
        >
            {sortOrder === "asc" ? "⬆️" : "⬇️"}
        </button>
        </div>
      {/* ================= MODAL ================= */}
      <Modal open={modalOpen} onClose={closeModal}>
        <h2>
          {mode === "create" ? "הוספת תלמיד" : "עריכת תלמיד"}
        </h2>

        <StudentForm
          initialData={mode === "edit" ? editingStudent : undefined}
          onSubmit={(data) => {
            setFormErrors(null);

            if (mode === "create") {
              createMutation.mutate(data, {
                onSuccess: () => {
                  closeModal();
                  queryClient.invalidateQueries({
                    queryKey: ["students"],
                  });
                },
                onError: (err: any) => {
                  setFormErrors(err.response?.data);
                },
              });
            } else {
              updateMutation.mutate(
                { id: editingStudent.id, data },
                {
                  onSuccess: () => {
                    closeModal();
                    queryClient.invalidateQueries({
                      queryKey: ["students"],
                    });
                  },
                  onError: (err: any) => {
                    setFormErrors(err.response?.data);
                  },
                }
              );
            }
          }}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
          errors={formErrors}
        />
      </Modal>

      {/* ================= TABLE ================= */}
      <table border={1}>
        <thead>
          <tr>
            <th>שם</th>
            <th>ת"ז</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
        {processedStudents?.length === 0 ? (
            <tr>
                <td colSpan={5}>לא נמצאו תלמידים</td>
            </tr>
            ):
          (processedStudents?.map((s) => (
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

                <button onClick={() => openEdit(s)}>
                  Edit
                </button>

                <button onClick={() => navigate(`/students/${s.id}`)}>
                  פתח
                </button>
              </td>
            </tr>
          )))} 
        </tbody>
      </table>
    </div>
  );
}