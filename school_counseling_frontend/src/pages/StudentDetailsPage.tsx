import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudent } from "../features/students/students.api";
import { useState } from "react";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("info");

  const { data, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(Number(id)),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.full_name}</h1>

      {/* 🧭 Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("info")}>פרטים</button>
        <button onClick={() => setTab("events")}>אירועים</button>
        <button onClick={() => setTab("sessions")}>פגישות</button>
        <button onClick={() => setTab("enrollments")}>הרשמות</button>
      </div>

      {/* 📌 Tab Content */}
      {tab === "info" && (
        <div>
          <p>ת"ז: {data.id_number}</p>
          <p>כתובת: {data.address}</p>
          <p>אמא: {data.mother_name}</p>
          <p>טלפון אמא: {data.mother_phone}</p>
          <p>אבא: {data.father_name}</p>
          <p>טלפון אבא: {data.father_phone}</p>
        </div>
      )}

      {tab === "events" && (
        <StudentEvents studentId={data.id} />
      )}

      {tab === "sessions" && (
        <StudentSessions studentId={data.id} />
      )}

      {tab === "enrollments" && (
        <StudentEnrollments studentId={data.id} />
      )}
    </div>
  );
}