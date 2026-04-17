import { useQuery } from "@tanstack/react-query";
import { getStudentEnrollments } from "../../students.api";

export default function StudentEnrollmentsTab({ studentId }: any) {
  const { data } = useQuery({
    queryKey: ["enrollments", studentId],
    queryFn: () => getStudentEnrollments(studentId),
  });

  return (
    <div>
      <h3>הרשמות</h3>

      {data?.map((e: any) => (
        <div key={e.id}>
          כיתה: {e.class_level} {e.class_number}
        </div>
      ))}
    </div>
  );
}