import { useState, useEffect } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading?: boolean;
  errors?: Record<string, string[]>;
  initialData?: any;
}

export default function StudentForm({
  onSubmit,
  loading,
  errors,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    full_name: "",
    id_number: "",
    address: "",
    mother_name: "",
    mother_phone: "",
    father_name: "",
    father_phone: "",
  });

  useEffect(() => {
    if (!initialData) {
      setForm({
        full_name: "",
        id_number: "",
        address: "",
        mother_name: "",
        mother_phone: "",
        father_name: "",
        father_phone: "",
      });
      return;
    }

    setForm({
      full_name: initialData.full_name || "",
      id_number: initialData.id_number || "",
      address: initialData.address || "",
      mother_name: initialData.mother_name || "",
      mother_phone: initialData.mother_phone || "",
      father_name: initialData.father_name || "",
      father_phone: initialData.father_phone || "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getError = (field: string) => errors?.[field]?.[0];

  return (
    <div>
      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="שם מלא"
      />
      <div style={{ color: "red" }}>{getError("full_name")}</div>

      <input
        name="id_number"
        value={form.id_number}
        onChange={handleChange}
        placeholder="ת״ז"
      />
      <div style={{ color: "red" }}>{getError("id_number")}</div>

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="כתובת"
      />

      <input
        name="mother_name"
        value={form.mother_name}
        onChange={handleChange}
        placeholder="שם אם"
      />

      <input
        name="mother_phone"
        value={form.mother_phone}
        onChange={handleChange}
        placeholder="טלפון אם"
      />
      <div style={{ color: "red" }}>{getError("mother_phone")}</div>

      <input
        name="father_name"
        value={form.father_name}
        onChange={handleChange}
        placeholder="שם אב"
      />

      <input
        name="father_phone"
        value={form.father_phone}
        onChange={handleChange}
        placeholder="טלפון אב"
      />
      <div style={{ color: "red" }}>{getError("father_phone")}</div>

      <button onClick={() => onSubmit(form)} disabled={loading}>
        שמור
      </button>
    </div>
  );
}