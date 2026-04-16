import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading?: boolean;
  errors?: Record<string, string[]>;
}

export default function StudentForm({ onSubmit, loading, errors }: Props) {
  const [form, setForm] = useState({
    full_name: "",
    id_number: "",
    address: "",
    mother_name: "",
    mother_phone: "",
    father_name: "",
    father_phone: "",
  });

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
        <input name="full_name" placeholder="שם מלא" onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("full_name")}</div>
      </div>

      <div>
        <input name="id_number" placeholder="ת״ז" onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("id_number")}</div>
      </div>

      <div>
        <input name="address" placeholder="כתובת" onChange={handleChange} />
      </div>

      <div>
        <input name="mother_name" placeholder="שם אם" onChange={handleChange} />
      </div>

      <div>
        <input name="mother_phone" placeholder="טלפון אם" onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("mother_phone")}</div>
      </div>

      <div>
        <input name="father_name" placeholder="שם אב" onChange={handleChange} />
      </div>

      <div>
        <input name="father_phone" placeholder="טלפון אב" onChange={handleChange} />
        <div style={{ color: "red" }}>{getError("father_phone")}</div>
      </div>

      <button onClick={() => onSubmit(form)} disabled={loading}>
        צור תלמיד
      </button>
    </div>
  );
}