import React, { useMemo } from "react";

interface RawEvent {
  id: string | number;
  title: string;
  // server may provide either start/end or date:
  start?: string; // ISO datetime
  end?: string; // ISO datetime
  date?: string; // ISO datetime (single point)
  description?: string;
  [k: string]: any;
}

function parseISO(s?: string) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function startOfWeek(date: Date) {
  // Monday as first day
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default function WeeklyView({ events }: { events: RawEvent[] }) {
  const hoursStart = 7;
  const hoursEnd = 20;
  const hourHeight = 60; // px per hour
  const totalHours = hoursEnd - hoursStart;
  const dayHeight = totalHours * hourHeight;

  const today = new Date();
  const weekStart = useMemo(() => startOfWeek(today), [today]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [weekStart]);

  // normalize events: compute start/end Date
  const normalized = useMemo(() => {
    return events.map((ev) => {
      const start = parseISO(ev.start) ?? parseISO(ev.date) ?? null;
      const end = parseISO(ev.end) ?? (start ? new Date(start.getTime() + 60 * 60 * 1000) : null); // default 1h
      return { ...ev, __start: start, __end: end };
    }).filter((e) => e.__start && e.__end);
  }, [events]);

  // group events per day
  const byDay = useMemo(() => {
    const map: Record<string, typeof normalized> = {};
    for (const d of days) {
      const key = d.toISOString().slice(0, 10);
      map[key] = [];
    }
    for (const ev of normalized) {
      // place event on its start day only (multi-day not supported here)
      const key = ev.__start!.toISOString().slice(0, 10);
      if (map[key]) map[key].push(ev);
    }
    return map;
  }, [normalized, days]);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="calendar-weekly">
      <div className="calendar-header">
        <div className="calendar-hour-col" />
        {days.map((d) => (
          <div key={d.toISOString()} className="calendar-day-header">
            <div>{d.toLocaleDateString()}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{d.toLocaleDateString(undefined, { weekday: "long" })}</div>
          </div>
        ))}
      </div>

      <div className="calendar-body" style={{ height: dayHeight }}>
        <div className="calendar-hour-column">
          {Array.from({ length: totalHours }).map((_, i) => {
            const hour = hoursStart + i;
            return (
              <div key={i} className="calendar-hour-cell" style={{ height: hourHeight }}>
                <div className="hour-label">{`${hour}:00`}</div>
              </div>
            );
          })}
        </div>

        <div className="calendar-days-grid" style={{ height: dayHeight }}>
          {days.map((d) => {
            const key = d.toISOString().slice(0, 10);
            const dayEvents = byDay[key] ?? [];
            return (
              <div key={key} className="calendar-day-column" style={{ height: dayHeight }}>
                {/* hour rows background */}
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div key={i} className="calendar-grid-cell" style={{ height: hourHeight }} />
                ))}

                {/* events */}
                {dayEvents.map((ev) => {
                  const s = ev.__start as Date;
                  const e = ev.__end as Date;
                  const startMinutes = (s.getHours() * 60 + s.getMinutes()) - hoursStart * 60;
                  const durationMinutes = Math.max(15, (e.getTime() - s.getTime()) / 60000); // min 15m
                  const top = (startMinutes / 60) * hourHeight;
                  const height = (durationMinutes / 60) * hourHeight;
                  return (
                    <div
                      key={ev.id}
                      className="calendar-event"
                      title={`${ev.title} • ${formatTime(s)} - ${formatTime(e)}`}
                      style={{
                        top: top,
                        height: Math.max(20, height),
                      }}
                    >
                      <div className="event-title">{ev.title}</div>
                      <div className="event-time">{`${formatTime(s)} - ${formatTime(e)}`}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}