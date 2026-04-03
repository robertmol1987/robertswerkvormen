import { ToolCard } from "./ToolCard";

export function CategoryGroupSection({ group, sortBy, images, onSelectTool }) {
  return (
    <div className="mb-10">
      <h3
        className="font-bold mb-1"
        style={{
          fontSize: "20px",
          color: "#1A1A1A",
          borderBottom: "2px solid #E8F0EC",
          paddingBottom: "8px",
        }}
      >
        {group.category}{" "}
        <span style={{ fontSize: "14px", fontWeight: 400, color: "#888" }}>
          ({group.tools.length} werkvormen)
        </span>
      </h3>
      {group.description && (
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#555",
            whiteSpace: "pre-wrap",
            marginTop: "6px",
            marginBottom: "4px",
          }}
        >
          {group.description}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(308px, 1fr))",
          gap: "16px",
          maxWidth: "1456px",
          marginTop: "12px",
        }}
      >
        {group.tools.map((tool, idx) => (
          <ToolCard
            key={idx}
            tool={tool}
            images={images}
            onSelectTool={onSelectTool}
          />
        ))}
      </div>
    </div>
  );
}
