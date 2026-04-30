// src/components/Calendar/MonthlyView.tsx
import React, { useMemo } from "react";

interface EventItem {
  id: number;
  title: string;
  date: string; // ISO e.g. 2024-04-20T10:00:00Z
  description?: string;
}

export default function MonthlyView({ events }: { events: EventItem[] }) {
  const grouped = useMemo(() => {
    const g: Record<string, EventItem[]> = {};
    events.forEach((ev) => {
      const day = ev.date?.slice(0, 10) ?? "לא ידוע";
      (g[day] ??= []).push(ev);
    });
    return g;
  }, [events]);

  // פשוטה: מציגה ימים עם האירועים — ניתן לשדרג ל־grid חודש מלא בעתיד
  const days = Object.keys(grouped).sort();

  return (
    <div>
      <h3>תצוגה חודשית</h3>
      {days.length === 0 && <div>אין אירועים לחודש זה</div>}
      {days.map((day) => (
        <div key={day} style={{ marginBottom: 10, padding: 8, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ fontWeight: 600 }}>{day}</div>
          {grouped[day].map((ev) => (
            <div key={ev.id} style={{ marginTop: 6 }}>
              <div>{ev.title}</div>
              {ev.description && <div style={{ fontSize: 12, color: "gray" }}>{ev.description}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}