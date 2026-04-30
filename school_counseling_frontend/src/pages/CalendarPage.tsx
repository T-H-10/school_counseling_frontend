import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/events.api";
import ViewToggle from "../components/ViewToggle";
import MonthlyView from "../components/calendar/MonthlyView";
import WeeklyView from "../components/calendar/WeeklyView";
import "../components/calendar/calendar.css";

function startOfWeekSunday(d: Date) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0 = Sunday
  dt.setDate(dt.getDate() - day);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export default function CalendarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const events = data?.results ?? [];

  // current anchor date (controls which week/month is shown)
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<"monthly" | "weekly">("weekly");

  // label for header
  const headerLabel = useMemo(() => {
    if (view === "weekly") {
      const start = startOfWeekSunday(anchorDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
    } else {
      return anchorDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }
  }, [anchorDate, view]);

  const goToday = () => setAnchorDate(new Date());
  const goPrev = () => {
    setAnchorDate((d) => {
      const nd = new Date(d);
      if (view === "weekly") nd.setDate(nd.getDate() - 7);
      else nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  };
  const goNext = () => {
    setAnchorDate((d) => {
      const nd = new Date(d);
      if (view === "weekly") nd.setDate(nd.getDate() + 7);
      else nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  };

  if (isLoading) return <div>טוען אירועים...</div>;

  // pass start-of-week (Sunday) for weekly view; for monthly pass anchorDate
  const weekStart = startOfWeekSunday(anchorDate);

  return (
    <div>
      <h1>לוח שנה</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={goPrev}>הקודם</button>
          <button onClick={goToday}>היום</button>
          <button onClick={goNext}>הבא</button>
        </div>

        <div style={{ fontWeight: 600 }}>{headerLabel}</div>

        <ViewToggle currentView={view} onChangeView={(v) => setView(v)} />
      </div>

      {view === "monthly" ? (
        <MonthlyView events={events} monthAnchor={anchorDate} />
      ) : (
        <WeeklyView events={events} weekStart={weekStart} />
      )}
    </div>
  );
}