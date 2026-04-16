import { useState, useEffect } from "react";

interface Props {
    onSubmit: (data: any) => void;
    loading?: boolean;
    errors?: Record<string, string[]>;
    initialData?: any;
  }

export default function StudentForm({ onSubmit, loading, errors, initialData }: Props) {
    const [form, setForm] = useState({
        full_name: initialData?.full_name || "",
        id_number: initialData?.id_number || "",
        address: initialData?.address || "",
        mother_name: initialData?.mother_name || "",
        mother_phone: initialData?.mother_phone || "",
        father_name: initialData?.father_name || "",
        father_phone: initialData?.father_phone || "",
    });

    useEffect(() => {
        if (initialData) {
          setForm({
            full_name: initialData.full_name || "",
            id_number: initialData.id_number || "",
            address: initialData.address || "",
            mother_name: initialData.mother_name || "",
            mother_phone: initialData.mother_phone || "",
            father_name: initialData.father_name || "",
            father_phone: initialData.father_phone || "",
          });
        } else {
          setForm({
            full_name: "",
            id_number: "",
            address: "",
            mother_name: "",
            mother_phone: "",
            father_name: "",
            father_phone: "",
          });
        }
      }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getError = (field: string) => {
    return errors?.[field]?.[0];
  };

  return (
    <div>
      <div>
        <input name="full_name" placeholder="שם מלא" value={form.full_name} onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("full_name")}</div>
      </div>

      <div>
        <input name="id_number" placeholder="ת״ז" value={form.id_number} onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("id_number")}</div>
      </div>

      <div>
        <input name="address" placeholder="כתובת" value={form.address} onChange={handleChange} />
      </div>

      <div>
        <input name="mother_name" placeholder="שם אם" value={form.mother_name} onChange={handleChange} />
      </div>

      <div>
        <input name="mother_phone" placeholder="טלפון אם" value={form.mother_phone} onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("mother_phone")}</div>
      </div>

      <div>
        <input name="father_name" placeholder="שם אב" value={form.father_name} onChange={handleChange} />
      </div>

      <div>
        <input name="father_phone" placeholder="טלפון אב"  value={form.father_phone} onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("father_phone")}</div>
      </div>

      <button onClick={() => onSubmit(form)} disabled={loading}>
        צור תלמיד
      </button>
    </div>
  );
}