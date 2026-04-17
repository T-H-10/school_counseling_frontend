import StudentTimeline from "../features/students/components/StudentTimeline";

export default function StudentDetailsPage() {
  return (
    <div style={{ padding: 20 }}>
      <StudentTimeline studentId={4} />
    </div>
  );
}

// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { getStudent } from "../features/students/students.api";
// import StudentInfoTab from "../features/students/components/tabs/StudentInfoTab";
// import StudentEnrollmentsTab from "../features/students/components/tabs/StudentEnrollmentsTab";
// import StudentEventsTab from "../features/students/components/tabs/StudentEventsTab";
// import StudentSessionsTab from "../features/students/components/tabs/StudentSessionsTab";


// export default function StudentDetailsPage() {
//   const { id } = useParams();
//   const [tab, setTab] = useState("info");

//   const studentId = Number(id);

//   const { data, isLoading } = useQuery({
//     queryKey: ["student", id],
//     queryFn: () => getStudent(studentId),
//   });

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       {/* HEADER */}
//       <h1>{data.full_name}</h1>
//       <p>ת"ז: {data.id_number}</p>

//       {/* TABS */}
//       <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//         <button onClick={() => setTab("info")}>פרטים</button>
//         <button onClick={() => setTab("events")}>אירועים</button>
//         <button onClick={() => setTab("sessions")}>פגישות</button>
//         <button onClick={() => setTab("enrollments")}>הרשמות</button>
//       </div>

//       <hr />

//       {/* CONTENT */}
//       {tab === "info" && <StudentInfoTab student={data} />}

//       {tab === "events" && <StudentEventsTab studentId={studentId} />}

//       {tab === "sessions" && <StudentSessionsTab studentId={studentId} />}

//       {tab === "enrollments" && (
//         <StudentEnrollmentsTab studentId={studentId} />
//       )}
//     </div>
//   );
// }