import { Dice5, Lightbulb, List, Heart } from "lucide-react";

export function ActionCards({
  onRandomWerkvorm,
  onRandomFavoriet,
  onShowFilterPanel,
  onShowGenereer,
  onShowAlleWerkvormen,
  activeFilterCount,
  filterCardRef,
}) {
  const activeFilterLabel =
    activeFilterCount > 0
      ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} actief`
      : "Klik om filters in te stellen";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "auto auto",
        gap: "16px",
        width: "100%",
        maxWidth: "900px",
        marginBottom: "40px",
      }}
    >
      {/* Card 1 — Willekeurig */}
      <div
        onClick={onRandomWerkvorm}
        style={{
          backgroundColor: "#143d2f",
          borderRadius: "18px",
          padding: "24px 16px 20px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          aspectRatio: "1",
          justifyContent: "center",
          gridColumn: "1",
          gridRow: "1",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,61,47,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Dice5 size={28} style={{ color: "#FFFFFF" }} />
        </div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Kies een willekeurige werkvorm
        </p>
      </div>

      {/* Card 2 — Met filters */}
      <div
        ref={filterCardRef}
        onClick={onShowFilterPanel}
        style={{
          backgroundColor: "#dec9a2",
          borderRadius: "18px",
          padding: "24px 16px 20px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          aspectRatio: "1",
          justifyContent: "center",
          position: "relative",
          gridColumn: "2",
          gridRow: "1",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Dice5 size={28} style={{ color: "#3D2E14" }} />
        </div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#3D2E14",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Willekeurig met filters
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "rgba(0,0,0,0.45)",
            marginTop: "6px",
          }}
        >
          {activeFilterLabel}
        </p>
      </div>

      {/* Card 3 — Genereer */}
      <div
        onClick={onShowGenereer}
        style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "18px",
          padding: "24px 16px 20px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          aspectRatio: "1",
          justifyContent: "center",
          gridColumn: "3",
          gridRow: "1",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "rgba(245,158,11,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Lightbulb size={28} style={{ color: "#92400E" }} />
        </div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#92400E",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Genereer een unieke werkvorm met AI
        </p>
      </div>

      {/* Card 4 — Alle werkvormen */}
      <div
        onClick={onShowAlleWerkvormen}
        style={{
          backgroundColor: "#F0F7F4",
          borderRadius: "18px",
          padding: "24px 16px 20px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          aspectRatio: "1",
          justifyContent: "center",
          gridColumn: "4",
          gridRow: "1",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,61,47,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "rgba(20,61,47,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <List size={28} style={{ color: "#143d2f" }} />
        </div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#143d2f",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Bekijk alle werkvormen
        </p>
      </div>

      {/* Favoriet van Robert button — row 2, column 1 */}
      <button
        onClick={onRandomFavoriet}
        style={{
          gridColumn: "1",
          gridRow: "2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "8px 12px",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #E5E7EB",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.15s",
          fontSize: "11px",
          fontWeight: 600,
          color: "#143d2f",
          marginTop: "-8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#FEF2F2";
          e.currentTarget.style.borderColor = "#E53E3E";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFFFF";
          e.currentTarget.style.borderColor = "#E5E7EB";
        }}
      >
        <Heart size={12} style={{ color: "#E53E3E" }} fill="#E53E3E" />
        Favoriet van Robert
      </button>
    </div>
  );
}
