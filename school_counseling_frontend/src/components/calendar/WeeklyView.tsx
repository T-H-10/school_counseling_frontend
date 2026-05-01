import React, { useEffect, useMemo, useState } from "react";
import { formatHebrewDate } from "../../utils/hebrewDate";

interface RawEvent {
  id: string | number;
  title: string;
  start?: string;
  end?: string;
  date?: string;
  description?: string;
  [k: string]: any;
}

function parseISO(s?: string) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export default function WeeklyView({
  events,
  weekStart,
}: {
  events: RawEvent[];
  weekStart?: Date;
}) {
  const hoursStart = 7;
  const hoursEnd = 20;
  const hourHeight = 60;
  const totalHours = hoursEnd - hoursStart;
  const dayHeight = totalHours * hourHeight;

  // use provided weekStart (already set to Sunday) or compute from today
  const startOfWeek = useMemo(() => {
    if (weekStart) {
      const d = new Date(weekStart);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const now = new Date();
    const day = now.getDay();
    const d = new Date(now);
    d.setDate(now.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [weekStart]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [startOfWeek]);

  const normalized = useMemo(() => {
    return events
      .map((ev) => {
        const start = parseISO(ev.start) ?? parseISO(ev.date) ?? null;
        const end = parseISO(ev.end) ?? (start ? new Date(start.getTime() + 60 * 60 * 1000) : null);
        return { ...ev, __start: start, __end: end };
      })
      .filter((e) => e.__start && e.__end);
  }, [events]);

  const byDay = useMemo(() => {
    const map: Record<string, typeof normalized> = {};
    for (const d of days) {
      const key = d.toISOString().slice(0, 10);
      map[key] = [];
    }
    for (const ev of normalized) {
      const key = ev.__start!.toISOString().slice(0, 10);
      if (map[key]) map[key].push(ev);
    }
    return map;
  }, [normalized, days]);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const HEB_CAL_CACHE_KEY = "hebcalDateCache_v1";
  const [hebrewMap, setHebrewMap] = useState<Map<string, string>>(new Map());

  const loadHebrewDates = async (dates: Date[]) => {
    const raw = localStorage.getItem(HEB_CAL_CACHE_KEY);
    const cache = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    const toFetch = dates
      .map((d) => d.toISOString().slice(0, 10))
      .filter((ds, i, arr) => !cache[ds] && arr.indexOf(ds) === i);

    if (toFetch.length > 0) {
      await Promise.all(
        toFetch.map(async (dateStr) => {
          try {
            const res = await fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=1`);
            if (!res.ok) throw new Error("bad response");
            const json = await res.json();
            cache[dateStr] = json?.hebrew ?? cache[dateStr] ?? "";
          } catch {
            // keep fallback empty; will use formatHebrewDate later
            cache[dateStr] = cache[dateStr] ?? "";
          }
        })
      );
      localStorage.setItem(HEB_CAL_CACHE_KEY, JSON.stringify(cache));
    }

    const map = new Map<string, string>();
    dates.forEach((d) => {
      const key = d.toISOString().slice(0, 10);
      map.set(key, cache[key] || "");
    });
    return map;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const map = await loadHebrewDates(days);
        if (mounted) setHebrewMap(map);
      } catch {
        // ignore, fallback handled in render
      }
    })();
    return () => {
      mounted = false;
    };
  }, [days]);
  
  return (
    <div className="calendar-weekly">
      <div className="calendar-header">
        <div className="calendar-hour-col" />
        {days.map((d) => (
          <div key={d.toISOString()} className="calendar-day-header">
            <div>{d.toLocaleDateString()}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{hebrewMap.get(d.toISOString().slice(0, 10)) || formatHebrewDate(d)}</div>
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
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div key={i} className="calendar-grid-cell" style={{ height: hourHeight }} />
                ))}

                {dayEvents.map((ev) => {
                  const s = ev.__start as Date;
                  const e = ev.__end as Date;
                  const startMinutes = (s.getHours() * 60 + s.getMinutes()) - hoursStart * 60;
                  const durationMinutes = Math.max(15, (e.getTime() - s.getTime()) / 60000);
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