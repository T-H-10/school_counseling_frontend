import React, { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";

type RecentEvent = {
  id: number;
  title: string;
  date: string;
  student_id: number;
};

type Stats = {
  students_count: number;
  events_this_week: number;
};

type DashboardResponse = {
  today_sessions: any[];
  recent_events: RecentEvent[];
  stats: Stats;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    httpClient.get<DashboardResponse>("/dashboard/")
        .then((res) => {
            if (mounted) setData(res.data);
        })
        .catch((e) => {
            if (mounted) {
                setError(e.response?.data?.detail || e.message || "Network error");
            }
        })
        .finally(() => {
            if (mounted) setLoading(false);
        });
        
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>לוח בקרה (Dashboard)</h2>

      <section>
        <h3>סטטיסטיקה</h3>
        <div>תלמידים: {data.stats.students_count}</div>
        <div>אירועים השבוע: {data.stats.events_this_week}</div>
      </section>

      <section>
        <h3>אירועים אחרונים</h3>
        {data.recent_events.length === 0 ? (
          <div>אין אירועים אחרונים</div>
        ) : (
          <ul>
            {data.recent_events.map((ev) => (
              <li key={ev.id}>
                <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleString()} (student #{ev.student_id})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>מפגשים היום</h3>
        {data.today_sessions.length === 0 ? (
          <div>אין מפגשים היום</div>
        ) : (
          <ul>
            {data.today_sessions.map((s, idx) => (
              <li key={idx}>{JSON.stringify(s)}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}