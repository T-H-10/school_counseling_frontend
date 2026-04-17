import { useQuery } from "@tanstack/react-query";
import { getStudentEvents } from "../../students.api";

export default function StudentEventsTab({ studentId }: any) {
  const { data } = useQuery({
    queryKey: ["events", studentId],
    queryFn: () => getStudentEvents(studentId),
  });

  return (
    <div>
      <h3>אירועים</h3>

      {data?.result?.map((e: any) => (
        <div key={e.id}>
          <b>{e.title}</b>
          <p>{e.description}</p>
        </div>
      ))}
    </div>
  );
}