import { X, ArrowRight, RefreshCw } from "lucide-react";
import { StarRating } from "@/components/ToolDetail/components/StarRating";

export function RevealOverlay({ tool, images, onGoToTool, onClose, onReRoll }) {
  return (
    <div
      className="reveal-fade"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10005,
        backgroundColor: "#0f3326",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "28px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        🎲 Jouw werkvorm is...
      </p>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          padding: "48px 56px",
          maxWidth: "620px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Close X button top-right */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "rgba(0,0,0,0.06)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.12)";
            e.currentTarget.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.06)";
            e.currentTarget.style.color = "#999";
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        {tool.icon &&
          tool.icon.imageName &&
          images &&
          images[tool.icon.imageName] && (
            <img
              src={images[tool.icon.imageName]}
              alt={tool.name}
              style={{
                maxWidth: "200px",
                maxHeight: "80px",
                objectFit: "contain",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #E5E7EB",
              }}
            />
          )}

        {/* Title */}
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#1A1A1A",
            marginBottom: "8px",
            lineHeight: 1.2,
            margin: "0 0 8px",
          }}
        >
          {tool.name}
        </h2>

        {/* Subtitle */}
        {tool.subtitle && (
          <p
            style={{
              fontSize: "16px",
              color: "#888",
              fontStyle: "italic",
              margin: "0 0 16px",
            }}
          >
            {tool.subtitle}
          </p>
        )}

        {/* Rating */}
        <div style={{ marginBottom: "20px" }}>
          <StarRating rating={tool.rating} />
        </div>

        {/* Beschrijving */}
        {(tool.description || tool.werkvormUitgelegd) && (
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "#444",
              marginBottom: "32px",
              maxWidth: "480px",
              textAlign: "center",
            }}
          >
            {tool.description || tool.werkvormUitgelegd}
          </p>
        )}

        {/* CTA button */}
        <button
          onClick={onGoToTool}
          style={{
            backgroundColor: "#143d2f",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "14px",
            padding: "16px 32px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,61,47,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Bekijk deze werkvorm
          <ArrowRight size={18} />
        </button>

        {/* Re-roll button */}
        <button
          onClick={onReRoll}
          style={{
            marginTop: "14px",
            backgroundColor: "#FFFFFF",
            color: "#143d2f",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <RefreshCw size={16} />
          Rol opnieuw
        </button>

        <p style={{ fontSize: "12px", color: "#CCC", marginTop: "14px" }}>
          Of wacht — je gaat er automatisch naartoe
        </p>
      </div>
    </div>
  );
}
