import { X } from "lucide-react";

export function LandingHeader({ toolCount, onDismiss }) {
  return (
    <>
      {/* Close / Skip button */}
      <button
        onClick={onDismiss}
        className="flex items-center gap-1.5"
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          zIndex: 10004,
          padding: "8px 16px",
          backgroundColor: "rgba(0,0,0,0.06)",
          border: "none",
          borderRadius: "10px",
          color: "#555",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)";
          e.currentTarget.style.color = "#333";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.06)";
          e.currentTarget.style.color = "#555";
        }}
      >
        Overslaan
        <X size={14} />
      </button>

      {/* Title */}
      <h1
        className="font-bold text-center"
        style={{
          fontSize: "clamp(42px, 6vw, 63px)",
          color: "#1A1A1A",
          lineHeight: 1.3,
          marginBottom: "18px",
        }}
      >
        Digitale Didactiek.com - Werkvormen
      </h1>

      {/* Subtitle with tool count */}
      <p
        className="text-center"
        style={{
          fontSize: "24px",
          color: "#666",
          marginBottom: "72px",
          maxWidth: "780px",
        }}
      >
        Totaal aantal werkvormen:{" "}
        <strong style={{ color: "#143d2f" }}>{toolCount}</strong>
      </p>
    </>
  );
}
