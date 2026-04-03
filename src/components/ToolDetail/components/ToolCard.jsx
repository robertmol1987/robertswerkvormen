import { Lightbulb } from "lucide-react";
import { StarRatingSmall } from "./StarRating";

export function ToolCard({ tool, images, onSelectTool }) {
  const urlValue = tool.url && tool.url.trim() !== "-" ? tool.url.trim() : "";
  const hasUrl = !!urlValue;
  const href = hasUrl
    ? urlValue.startsWith("http")
      ? urlValue
      : "https://" + urlValue
    : undefined;

  const hasIcon =
    tool.icon && tool.icon.imageName && images && images[tool.icon.imageName];

  const isFavoriet =
    tool.tags &&
    tool.tags.some((t) => t.toLowerCase().includes("favoriet van robert"));

  const bgColor = isFavoriet ? "#EEFAE8" : "#FAFAFA";
  const borderClr = isFavoriet ? "#A3D98E" : "#EEEEEE";
  const hoverBg = isFavoriet ? "#E0F5D6" : "#F0F7F4";
  const hoverBorder = isFavoriet ? "#6BBF50" : "#143d2f60";

  const handleUrlClick = (e) => {
    e.stopPropagation();
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  // Show compact meta info on card
  const metaItems = [];
  if (tool.duur) metaItems.push(tool.duur);
  if (tool.analoogDigitaal && tool.analoogDigitaal.length > 0) {
    metaItems.push(tool.analoogDigitaal.join(", "));
  }

  return (
    <div
      onClick={() => onSelectTool(tool)}
      className="flex flex-col items-center text-center rounded-xl transition-all"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderClr}`,
        padding: "24px 16px 20px",
        textDecoration: "none",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg;
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
        e.currentTarget.style.borderColor = borderClr;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* URL button top-right */}
      {hasUrl && (
        <button
          onClick={handleUrlClick}
          title="Open website"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            padding: "4px 10px",
            borderRadius: "6px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#999",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E8F0EC";
            e.currentTarget.style.color = "#143d2f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#999";
          }}
        >
          Open
        </button>
      )}

      {/* Icon */}
      {hasIcon ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "56px",
            maxHeight: "72px",
            marginBottom: "12px",
          }}
        >
          <img
            src={images[tool.icon.imageName]}
            alt={tool.name}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "160px",
              maxHeight: "64px",
              objectFit: "contain",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "14px",
            backgroundColor: "#E8F0EC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
          }}
        >
          <Lightbulb size={24} style={{ color: "#143d2f", opacity: 0.5 }} />
        </div>
      )}

      {/* Name */}
      <h3
        className="font-semibold"
        style={{
          fontSize: "15px",
          color: "#1A1A1A",
          marginBottom: "4px",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {tool.name}
      </h3>

      {/* Subtitle */}
      {tool.subtitle && (
        <p
          style={{
            fontSize: "12px",
            color: "#888",
            fontStyle: "italic",
            marginBottom: "8px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tool.subtitle}
        </p>
      )}

      {/* Meta info */}
      {metaItems.length > 0 && (
        <p
          style={{
            fontSize: "11px",
            color: "#999",
            marginBottom: "6px",
          }}
        >
          {metaItems.join(" · ")}
        </p>
      )}

      {/* Rating */}
      <StarRatingSmall rating={tool.rating} />
    </div>
  );
}
