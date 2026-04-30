import React from "react";

interface ViewToggleProps {
  currentView: "monthly" | "weekly";
  onChangeView: (view: "monthly" | "weekly") => void;
}

export default function ViewToggle({ currentView, onChangeView }: ViewToggleProps) {
  return (
    <div className="view-toggle" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <button
        onClick={() => onChangeView("monthly")}
        style={{
          padding: "6px 10px",
          background: currentView === "monthly" ? "#3b82f6" : undefined,
          color: currentView === "monthly" ? "white" : undefined,
          borderRadius: 6,
          border: "1px solid #ddd",
        }}
      >
        תצוגה חודשית
      </button>
      <button
        onClick={() => onChangeView("weekly")}
        style={{
          padding: "6px 10px",
          background: currentView === "weekly" ? "#3b82f6" : undefined,
          color: currentView === "weekly" ? "white" : undefined,
          borderRadius: 6,
          border: "1px solid #ddd",
        }}
      >
        תצוגה שבועית
      </button>
    </div>
  );
}