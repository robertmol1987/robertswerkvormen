import { useState, useRef } from "react";
import {
  Dice5,
  Lightbulb,
  List,
  X,
  Star,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  sortDoelgroepen,
  sortAnaloogDigitaal,
  sortPlaatsTijd,
} from "@/utils/filterSortOrder";
import { StarRating } from "@/components/ToolDetail/components/StarRating";
import { playDiceRoll, playReveal } from "@/utils/sounds";

export function ActionBar({
  tools,
  onSelectTool,
  onShowGenereer,
  onShowAlleWerkvormen,
  allGoals,
  allDoelgroepen,
  allAnaloogDigitaal,
  allPlaatsTijd,
  allCategories,
  images,
}) {
  const [rolling, setRolling] = useState(false);
  const [revealTool, setRevealTool] = useState(null);
  const [lastRollWasFiltered, setLastRollWasFiltered] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterGoal, setFilterGoal] = useState("");
  const [filterCategorie, setFilterCategorie] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [filterDoelgroep, setFilterDoelgroep] = useState([]);
  const [filterAnaloog, setFilterAnaloog] = useState([]);
  const [filterPlaats, setFilterPlaats] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const rollTimeoutRef = useRef(null);
  const autoGoTimeoutRef = useRef(null);

  const pickRandom = (pool) =>
    pool && pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : null;

  const getFilteredPool = () => {
    if (!tools || tools.length === 0) return [];
    return tools.filter((t) => {
      const matchGoal =
        !filterGoal ||
        (t.goals &&
          t.goals.some((g) =>
            g.toLowerCase().includes(filterGoal.toLowerCase()),
          ));
      const matchCat =
        filterCategorie.length === 0 ||
        filterCategorie.some(
          (c) =>
            t.categories &&
            t.categories.some((tc) => tc.toLowerCase() === c.toLowerCase()),
        );
      const matchRating = filterRating === 0 || t.rating >= filterRating;
      const matchDg =
        filterDoelgroep.length === 0 ||
        filterDoelgroep.some(
          (dg) =>
            t.doelgroepen &&
            t.doelgroepen.some((d) => d.toLowerCase() === dg.toLowerCase()),
        );
      const matchAd =
        filterAnaloog.length === 0 ||
        filterAnaloog.some(
          (ad) =>
            t.analoogDigitaal &&
            t.analoogDigitaal.some((a) => a.toLowerCase() === ad.toLowerCase()),
        );
      const matchPt =
        filterPlaats.length === 0 ||
        filterPlaats.some(
          (pt) =>
            t.plaatsTijd &&
            t.plaatsTijd.some((p) => p.toLowerCase() === pt.toLowerCase()),
        );
      return (
        matchGoal && matchCat && matchRating && matchDg && matchAd && matchPt
      );
    });
  };

  const showReveal = (pick) => {
    playReveal();
    setRevealTool(pick);
    autoGoTimeoutRef.current = setTimeout(() => {
      handleGoToTool(pick);
    }, 6000);
  };

  const handleGoToTool = (tool) => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    setRevealTool(null);
    onSelectTool(tool);
  };

  const handleCloseReveal = () => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    setRevealTool(null);
  };

  const doRoll = (pool, filtered) => {
    if (!pool || pool.length === 0) {
      setNoResult(true);
      return;
    }
    setNoResult(false);
    setShowFilterPanel(false);
    setLastRollWasFiltered(filtered);
    setRolling(true);
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    playDiceRoll(3600);
    clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(() => {
      setRolling(false);
      const pick = pickRandom(pool);
      if (pick) showReveal(pick);
    }, 3600);
  };

  const handleRandom = () => {
    if (!tools || tools.length === 0) return;
    doRoll(tools, false);
  };

  const handleFilteredRandom = () => {
    const filtered = getFilteredPool();
    doRoll(filtered, true);
  };

  const handleReRoll = () => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    const pool = lastRollWasFiltered ? getFilteredPool() : tools;
    setRevealTool(null);
    doRoll(pool, lastRollWasFiltered);
  };

  const toggle = (arr, setArr, val) => {
    if (arr.includes(val)) setArr(arr.filter((v) => v !== val));
    else setArr([...arr, val]);
  };

  const hasFilter =
    filterGoal ||
    filterCategorie.length > 0 ||
    filterRating > 0 ||
    filterDoelgroep.length > 0 ||
    filterAnaloog.length > 0 ||
    filterPlaats.length > 0;

  const sortedTypes = sortAnaloogDigitaal(allAnaloogDigitaal);
  const sortedDoelgroepen = sortDoelgroepen(allDoelgroepen);
  const sortedLocatie = sortPlaatsTijd(allPlaatsTijd);

  return (
    <div
      className="flex-shrink-0"
      style={{
        backgroundColor: "#FAFAFA",
        borderBottom: "1px solid #E5E7EB",
        position: "relative",
      }}
    >
      {/* Dice overlay */}
      {rolling && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              fontSize: "80px",
              animation: "diceRoll 0.4s ease-in-out infinite",
            }}
          >
            🎲
          </div>
        </div>
      )}

      {/* Reveal overlay — shown after dice roll */}
      {revealTool && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#0f3326",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            animation: "revealFadeIn 0.35s ease-out",
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
              onClick={handleCloseReveal}
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

            {revealTool.icon &&
              revealTool.icon.imageName &&
              images &&
              images[revealTool.icon.imageName] && (
                <img
                  src={images[revealTool.icon.imageName]}
                  alt={revealTool.name}
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

            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#1A1A1A",
                lineHeight: 1.2,
                margin: "0 0 8px",
              }}
            >
              {revealTool.name}
            </h2>

            {revealTool.subtitle && (
              <p
                style={{
                  fontSize: "16px",
                  color: "#888",
                  fontStyle: "italic",
                  margin: "0 0 16px",
                }}
              >
                {revealTool.subtitle}
              </p>
            )}

            <div style={{ marginBottom: "20px" }}>
              <StarRating rating={revealTool.rating} />
            </div>

            {(revealTool.description || revealTool.werkvormUitgelegd) && (
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
                {revealTool.description || revealTool.werkvormUitgelegd}
              </p>
            )}

            <button
              onClick={() => handleGoToTool(revealTool)}
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
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(20,61,47,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Bekijk deze werkvorm
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleReRoll}
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
      )}

      {/* Main bar — 4 buttons */}
      <div className="flex items-stretch" style={{ minHeight: "44px" }}>
        {/* 1 — Random */}
        <ActionBtn
          icon={<Dice5 size={15} />}
          label="Willekeurige werkvorm"
          color="#143d2f"
          bg="#E8F0EC"
          onClick={handleRandom}
        />

        {/* 2 — Filtered random */}
        <ActionBtn
          icon={<Dice5 size={15} />}
          label="Willekeurig met filters"
          color="#92400E"
          bg="#FFF7ED"
          active={showFilterPanel}
          onClick={() => setShowFilterPanel((v) => !v)}
          badge={hasFilter ? "●" : null}
        />

        {/* 3 — Genereer */}
        <ActionBtn
          icon={<Lightbulb size={15} />}
          label="Genereer met AI"
          color="#6D28D9"
          bg="#F5F3FF"
          onClick={onShowGenereer}
        />

        {/* 4 — Alle werkvormen */}
        <ActionBtn
          icon={<List size={15} />}
          label="Alle werkvormen"
          color="#1E40AF"
          bg="#EFF6FF"
          onClick={onShowAlleWerkvormen}
          last
        />
      </div>

      {/* Filter panel — floating popup overlay */}
      {showFilterPanel && (
        <>
          <div
            onClick={() => setShowFilterPanel(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 9997,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9998,
              width: "420px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              backgroundColor: "#f7f0e4",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              border: "2px solid #dec9a2",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-sm font-semibold"
                style={{ color: "#3D2E14" }}
              >
                🎲 Filters voor willekeurige werkvorm
              </span>
              <button
                onClick={() => setShowFilterPanel(false)}
                style={{
                  color: "#5C4A28",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Doelen */}
              {allGoals && allGoals.length > 0 && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: "#5C4A28" }}
                  >
                    Doelen
                  </label>
                  <select
                    value={filterGoal}
                    onChange={(e) => setFilterGoal(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg text-sm"
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontSize: "13px",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <option value="">Alle doelen</option>
                    {allGoals.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Categorie */}
              {allCategories && allCategories.length > 0 && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: "#5C4A28" }}
                  >
                    Categorie
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allCategories.map((cat) => {
                      const isActive = filterCategorie.includes(cat);
                      return (
                        <Chip
                          key={cat}
                          label={cat}
                          active={isActive}
                          onToggle={() =>
                            toggle(filterCategorie, setFilterCategorie, cat)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Beoordeling */}
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: "#5C4A28" }}
                >
                  Minimale beoordeling
                </label>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setFilterRating(r === filterRating ? 0 : r)
                      }
                      className="flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor:
                          filterRating === r && r > 0 ? "#3D2E14" : "#FFFFFF",
                        color:
                          filterRating === r && r > 0 ? "#FFFFFF" : "#5C4A28",
                        border:
                          filterRating === r && r > 0
                            ? "1px solid #3D2E14"
                            : "1px solid rgba(0,0,0,0.15)",
                        cursor: "pointer",
                      }}
                    >
                      {r === 0 ? (
                        "Alle"
                      ) : (
                        <>
                          {r} <Star size={10} fill="currentColor" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doelgroep */}
              {sortedDoelgroepen.length > 0 && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: "#5C4A28" }}
                  >
                    Doelgroep
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedDoelgroepen.map((dg) => (
                      <Chip
                        key={dg}
                        label={dg}
                        active={filterDoelgroep.includes(dg)}
                        onToggle={() =>
                          toggle(filterDoelgroep, setFilterDoelgroep, dg)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Type */}
              {sortedTypes.length > 0 && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: "#5C4A28" }}
                  >
                    Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedTypes.map((ad) => (
                      <Chip
                        key={ad}
                        label={ad}
                        active={filterAnaloog.includes(ad)}
                        onToggle={() =>
                          toggle(filterAnaloog, setFilterAnaloog, ad)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Locatie */}
              {sortedLocatie.length > 0 && (
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: "#5C4A28" }}
                  >
                    Locatie
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedLocatie.map((pt) => (
                      <Chip
                        key={pt}
                        label={pt}
                        active={filterPlaats.includes(pt)}
                        onToggle={() =>
                          toggle(filterPlaats, setFilterPlaats, pt)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleFilteredRandom}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "#3D2E14",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <Dice5 size={15} />🎲 Gooi de dobbelsteen!
              </button>
              {hasFilter && (
                <button
                  onClick={() => {
                    setFilterGoal("");
                    setFilterCategorie([]);
                    setFilterRating(0);
                    setFilterDoelgroep([]);
                    setFilterAnaloog([]);
                    setFilterPlaats([]);
                    setNoResult(false);
                  }}
                  className="text-xs px-3 py-1.5 rounded transition-all"
                  style={{
                    color: "#3D2E14",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}
                >
                  Wis filters
                </button>
              )}
            </div>
            {noResult && (
              <p
                className="text-sm mt-2 text-center"
                style={{ color: "#B91C1C" }}
              >
                Geen werkvorm gevonden met deze filters.
              </p>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes diceRoll {
          0% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(72deg) scale(1.2); }
          40% { transform: rotate(144deg) scale(0.9); }
          60% { transform: rotate(216deg) scale(1.3); }
          80% { transform: rotate(288deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes revealFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function ActionBtn({ icon, label, color, bg, onClick, active, badge, last }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 flex-1 text-xs font-medium transition-all"
      style={{
        color,
        backgroundColor: active ? bg : "transparent",
        borderTop: "none",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: last ? "none" : "1px solid #E5E7EB",
        padding: "10px 8px",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active ? bg : "transparent";
      }}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span style={{ fontSize: "8px", color, marginLeft: "2px" }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Chip({ label, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
      style={{
        backgroundColor: active ? "#143d2f" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#555",
        border: active ? "1px solid #143d2f" : "1px solid #D1D5DB",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
