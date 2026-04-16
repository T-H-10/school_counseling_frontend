import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getStudents,
    deleteStudent,
    createStudent,
    updateStudent,
  } from "../features/students/students.api";
  
  import StudentForm from "../features/students/StudentForm";
  import Modal from "../components/ui/Modal";
  
  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  export default function StudentsPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editingStudent, setEditingStudent] = useState<any>(null);
    const [formErrors, setFormErrors] = useState<any>(null);
  
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
  
    const [sortField, setSortField] = useState<"full_name" | "id_number">("full_name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
    const [page, setPage] = useState(1);
  
    // ================= DEBOUNCE =================
    useEffect(() => {
      const t = setTimeout(() => {
        setDebouncedSearch(search);
        setPage(1); // reset page on search
      }, 400);
  
      return () => clearTimeout(t);
    }, [search]);
  
    // ================= QUERY =================
    const { data, isLoading, isFetching } = useQuery({
      queryKey: ["students", page, debouncedSearch, sortField, sortOrder],
      queryFn: () =>
        getStudents({
          page,
          search: debouncedSearch || undefined,
          ordering:
            sortOrder === "asc"
              ? sortField
              : `-${sortField}`,
        }),
      keepPreviousData: true,
    });
  
    const students = data?.results ?? [];
  
    // ================= MUTATIONS =================
    const deleteMutation = useMutation({
      mutationFn: deleteStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["students"],
        });
      },
    });
  
    const createMutation = useMutation({
      mutationFn: createStudent,
    });
  
    const updateMutation = useMutation({
      mutationFn: ({ id, data }: any) =>
        updateStudent(id, data),
    });
  
    // ================= MODAL =================
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
  
    // ================= UI =================
    return (
      <div>
        <h1>Students</h1>
  
        <button onClick={openCreate}>
          ➕ הוסף תלמיד
        </button>
  
        <hr />
  
        {/* 🔍 SEARCH + SORT */}
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="חיפוש לפי שם או ת״ז..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
  
          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as any)
            }
          >
            <option value="full_name">שם</option>
            <option value="id_number">ת"ז</option>
          </select>
  
          <button
            onClick={() =>
              setSortOrder((p) =>
                p === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortOrder === "asc" ? "⬆️" : "⬇️"}
          </button>
        </div>
  
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
            {isLoading ? (
              <tr>
                <td colSpan={3}>טוען...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  לא נמצאו תלמידים
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>{s.id_number}</td>
  
                  <td>
                    <button
                      onClick={() => {
                        if (
                          !confirm("Are you sure?")
                        )
                          return;
                        deleteMutation.mutate(s.id);
                      }}
                    >
                      Delete
                    </button>
  
                    <button
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
  
                    <button
                      onClick={() =>
                        navigate(
                          `/students/${s.id}`
                        )
                      }
                    >
                      פתח
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
  
        {/* ================= LOADING ================= */}
        {isFetching && (
          <div>מעדכן נתונים...</div>
        )}
  
        {/* ================= PAGINATION ================= */}
        <div style={{ marginTop: 10 }}>
          <button
            disabled={!data?.previous}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            הקודם
          </button>
  
          <span style={{ margin: "0 10px" }}>
            עמוד {page}
          </span>
  
          <button
            disabled={!data?.next}
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            הבא
          </button>
        </div>
  
        {/* ================= MODAL ================= */}
        <Modal open={modalOpen} onClose={closeModal}>
          <h2>
            {mode === "create"
              ? "הוספת תלמיד"
              : "עריכת תלמיד"}
          </h2>
  
          <StudentForm
            initialData={
              mode === "edit"
                ? editingStudent
                : undefined
            }
            onSubmit={(formData) => {
              setFormErrors(null);
  
              const mutation =
                mode === "create"
                  ? createMutation
                  : updateMutation;
  
              mutation.mutate(
                mode === "create"
                  ? formData
                  : {
                      id: editingStudent.id,
                      data: formData,
                    },
                {
                  onSuccess: () => {
                    closeModal();
                    queryClient.invalidateQueries({
                      queryKey: ["students"],
                    });
                  },
                  onError: (err: any) => {
                    setFormErrors(
                      err.response?.data
                    );
                  },
                }
              );
            }}
            loading={
              createMutation.isPending ||
              updateMutation.isPending
            }
            errors={formErrors}
          />
        </Modal>
      </div>
    );
  }