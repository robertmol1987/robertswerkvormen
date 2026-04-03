import { Target } from "lucide-react";

export function GoalCard({ goal, toolCount, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center text-center rounded-lg transition-all"
      style={{
        backgroundColor: "#F0F7F4",
        border: "1px solid #D1E7D9",
        padding: "10px 11px 9px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#E0F0E6";
        e.currentTarget.style.borderColor = "#143d2f60";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#F0F7F4";
        e.currentTarget.style.borderColor = "#D1E7D9";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          backgroundColor: "#143d2f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "6px",
        }}
      >
        <Target size={11} style={{ color: "#FFFFFF" }} />
      </div>
      <h3
        className="font-semibold"
        style={{
          fontSize: "12px",
          color: "#1A1A1A",
          marginBottom: "3px",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {goal}
      </h3>
      <span
        className="text-xs px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: "#E8F0EC",
          color: "#143d2f",
          fontWeight: 500,
          fontSize: "10px",
        }}
      >
        {toolCount} {toolCount === 1 ? "werkvorm" : "werkvormen"}
      </span>
    </div>
  );
}
