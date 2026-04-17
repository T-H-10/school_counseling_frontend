import { useQuery } from "@tanstack/react-query";
import { getStudentSessions } from "../../students.api";

export default function StudentSessionsTab({ studentId }: any) {
  const { data } = useQuery({
    queryKey: ["sessions", studentId],
    queryFn: () => getStudentSessions(studentId),
  });

  return (
    <div>
      <h3>פגישות</h3>

      {data?.map((s: any) => (
        <div key={s.id}>
          <b>{s.title}</b>
          <p>{s.summary}</p>
          <small>{s.date}</small>
        </div>
      ))}
    </div>
  );
}