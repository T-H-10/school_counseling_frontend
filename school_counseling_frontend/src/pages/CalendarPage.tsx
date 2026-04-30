// src/pages/CalendarPage.tsx
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/events.api";

export default function CalendarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  if (isLoading) return <div>טוען אירועים...</div>;


  const grouped: Record<string, any[]> = {};
  (data.results || []).forEach((ev: any) => {
    const date = ev.date?.slice(0, 10) ?? "לא ידוע";
    (grouped[date] ??= []).push(ev);
  });

  return (
    <div>
      <h1>לוח שנה</h1>
      {Object.keys(grouped).length === 0 && <div>אין אירועים</div>}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} style={{ marginBottom: 12, padding: 8, border: "1px solid #eee", borderRadius: 6 }}>
          <b>{date}</b>
          {items.map((it: any) => (
            <div key={it.id}>
              <div>{it.title}</div>
              <div style={{ fontSize: 12, color: "gray" }}>{it.description}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}