import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../../../api/httpClient";

export default function StudentTimeline({ studentId }: any) {
  const { data, isLoading } = useQuery({
    queryKey: ["timeline", studentId],
    queryFn: async () => {
      const res = await httpClient.get(`/students/${studentId}/timeline/`);
      return res.data.timeline;
    },
  });

  if (isLoading) return <div>טוען טיימליין...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>📅 היסטוריית תלמיד</h2>

      {data?.map((item: any, index: number) => (
        <div
          key={index}
          style={{
            padding: 12,
            borderRight: item.type === "event" ? "4px solid #3b82f6" : "4px solid #10b981",
            background: "#f9fafb",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "gray" }}>
            {item.date}
          </div>

          <b>
            {item.type === "event" ? "🟦 " : "🟩 "}
            {item.title}
          </b>

          <div style={{ marginTop: 4 }}>
            {item.description}
          </div>

          <div style={{ fontSize: 11, opacity: 0.6 }}>
            {item.scope === "personal" ? "אישי" : "כיתתי"}
          </div>
        </div>
      ))}
    </div>
  );
}