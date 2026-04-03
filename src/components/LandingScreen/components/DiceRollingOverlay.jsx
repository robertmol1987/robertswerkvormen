export function DiceRollingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10003,
      }}
    >
      <div className="dice-roll-anim" style={{ fontSize: "80px" }}>
        🎲
      </div>
    </div>
  );
}
