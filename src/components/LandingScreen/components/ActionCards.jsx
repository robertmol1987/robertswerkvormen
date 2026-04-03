import { Dice5, List, Lightbulb, Heart } from "lucide-react";

export function ActionCards({
  onRandomWerkvorm,
  onRandomFavoriet,
  onShowFilters,
  onShowGenereer,
  onShowAlleWerkvormen,
  activeFilterCount,
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
        gap: "30px",
        width: "100%",
        maxWidth: "1290px",
        marginBottom: "72px",
      }}
    >
      {/* Card 1 — Willekeurig */}
      <div
        onClick={onRandomWerkvorm}
        style={{
          backgroundColor: "#143d2f",
          borderRadius: "30px",
          padding: "42px 30px 36px",
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
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            backgroundColor: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Dice5 size={48} style={{ color: "#FFFFFF" }} />
        </div>
        <p
          style={{
            fontSize: "21px",
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
        onClick={onShowFilters}
        style={{
          backgroundColor: "#dec9a2",
          borderRadius: "30px",
          padding: "42px 30px 36px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          aspectRatio: "1",
          justifyContent: "center",
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
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            backgroundColor: "rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Dice5 size={48} style={{ color: "#3D2E14" }} />
        </div>
        <p
          style={{
            fontSize: "21px",
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
            fontSize: "16px",
            color: "rgba(0,0,0,0.45)",
            marginTop: "9px",
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
          borderRadius: "30px",
          padding: "42px 30px 36px",
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
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            backgroundColor: "rgba(245,158,11,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Lightbulb size={48} style={{ color: "#92400E" }} />
        </div>
        <p
          style={{
            fontSize: "21px",
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
          borderRadius: "30px",
          padding: "42px 30px 36px",
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
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            backgroundColor: "rgba(20,61,47,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <List size={48} style={{ color: "#143d2f" }} />
        </div>
        <p
          style={{
            fontSize: "21px",
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
          gap: "8px",
          padding: "12px 16px",
          backgroundColor: "#FFFFFF",
          border: "2px solid #E5E7EB",
          borderRadius: "14px",
          cursor: "pointer",
          transition: "all 0.15s",
          fontSize: "14px",
          fontWeight: 600,
          color: "#143d2f",
          marginTop: "-18px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#FEF2F2";
          e.currentTarget.style.borderColor = "#E53E3E";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(229,62,62,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFFFF";
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Heart size={16} style={{ color: "#E53E3E" }} fill="#E53E3E" />
        Willekeurig (favoriet van Robert)
      </button>
    </div>
  );
}
