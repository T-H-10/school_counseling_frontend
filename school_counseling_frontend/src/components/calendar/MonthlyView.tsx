import React, { useMemo } from "react";

interface EventItem {
  id: number | string;
  title: string;
  date: string; // ISO
  description?: string;
  [k: string]: any;
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function MonthlyView({ events, monthAnchor }: { events: EventItem[]; monthAnchor?: Date }) {
  const anchor = useMemo(() => (monthAnchor ? new Date(monthAnchor) : new Date()), [monthAnchor]);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  // first day of month
  const firstOfMonth = useMemo(() => {
    const d = new Date(year, month, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [year, month]);

  // find first Sunday on or before firstOfMonth
  const firstGridDate = useMemo(() => {
    const d = new Date(firstOfMonth);
    const day = d.getDay(); // 0 Sun
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [firstOfMonth]);

  // build 6x7 grid (42 days)
  const grid: Date[] = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(firstGridDate);
      d.setDate(firstGridDate.getDate() + i);
      return d;
    });
  }, [firstGridDate]);

  const grouped = useMemo(() => {
    const g: Record<string, EventItem[]> = {};
    for (const ev of events) {
      const key = ev.date?.slice(0, 10) ?? "";
      (g[key] ??= []).push(ev);
    }
    return g;
  }, [events]);

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>
        {anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {/* headers: Sunday..Saturday */}
        {["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"].map((h, idx) => (
          <div key={idx} style={{ fontWeight: 700, textAlign: "center", padding: 6 }}>
            {h}
          </div>
        ))}

        {grid.map((d) => {
          const key = dateKey(d);
          const dayEvents = grouped[key] ?? [];
          const isCurrentMonth = d.getMonth() === month;
          return (
            <div
              key={key}
              style={{
                minHeight: 88,
                border: "1px solid #eee",
                borderRadius: 6,
                padding: 8,
                boxSizing: "border-box",
                background: isCurrentMonth ? "#fff" : "#fafafa",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: isCurrentMonth ? "#000" : "#999" }}>{d.getDate()}</div>
              </div>

              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                {dayEvents.slice(0, 3).map((ev) => (
                  <div key={ev.id} style={{ background: "#e6f0ff", padding: "4px 6px", borderRadius: 4, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ev.title}
                  </div>
                ))}

                {dayEvents.length > 3 && <div style={{ fontSize: 12, color: "#666" }}>+{dayEvents.length - 3} עוד</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}