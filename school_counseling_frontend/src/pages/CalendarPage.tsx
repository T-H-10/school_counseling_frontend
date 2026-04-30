import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/events.api";
import ViewToggle from "../components/ViewToggle";
import MonthlyView from "../components/calendar/MonthlyView";
import WeeklyView from "../components/calendar/WeeklyView";
import "../components/calendar/calendar.css";

export default function CalendarPage() {
  // ...existing code...
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const [view, setView] = useState<"monthly" | "weekly">("weekly"); // default weekly
  const events = data?.results ?? [];

  if (isLoading) return <div>טוען אירועים...</div>;

  return (
    <div>
      <h1>לוח שנה</h1>

      <ViewToggle currentView={view} onChangeView={setView} />

      {view === "monthly" ? (
        <MonthlyView events={events} />
      ) : (
        <WeeklyView events={events} />
      )}
    </div>
  );
}