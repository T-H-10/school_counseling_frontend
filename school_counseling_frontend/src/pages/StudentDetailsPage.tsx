import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../api/httpClient";

const getStudent = async (id: string) => {
  const res = await httpClient.get(`/students/${id}/`);
  return res.data;
};

export default function StudentDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id!),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.full_name}</h1>

      <div>ת"ז: {data.id_number}</div>
      <div>כתובת: {data.address}</div>

      <hr />

      {/* כאן נרחיב בהמשך */}
      <h2>פגישות</h2>
      <h2>אירועים</h2>
      <h2>הרשמות</h2>
    </div>
  );
}