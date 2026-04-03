import { SlidersHorizontal, X, Dice5, Star } from "lucide-react";
import {
  sortDoelgroepen,
  sortAnaloogDigitaal,
  sortPlaatsTijd,
} from "@/utils/filterSortOrder";

export function FilterPanel({
  filterPanelRef,
  onClose,
  allGoals,
  filterGoal,
  setFilterGoal,
  allCategories,
  filterCategorie,
  toggleFilterCategorie,
  filterRating,
  setFilterRating,
  allDoelgroepen,
  filterDoelgroep,
  toggleFilterDoelgroep,
  allAnaloogDigitaal,
  filterAnaloog,
  toggleFilterAnaloog,
  allPlaatsTijd,
  filterPlaats,
  toggleFilterPlaats,
  onFilteredRandom,
  hasAnyFilterSelected,
  noResult,
}) {
  const sortedDoelgroepen = sortDoelgroepen(allDoelgroepen);
  const sortedTypes = sortAnaloogDigitaal(allAnaloogDigitaal);
  const sortedPlaatsTijd = sortPlaatsTijd(allPlaatsTijd);

  return (
    <div
      ref={filterPanelRef}
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
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "18px" }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            color: "#3D2E14",
          }}
        >
          <SlidersHorizontal
            size={16}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: "8px",
            }}
          />
          Filters instellen
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#5C4A28",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {allGoals && allGoals.length > 0 && (
        <div className="mb-3">
          <label
            className="text-xs font-semibold block mb-1.5"
            style={{ color: "#5C4A28" }}
          >
            Doel
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
      {allCategories && allCategories.length > 0 && (
        <FilterChipRow
          label="Categorie"
          items={allCategories}
          selected={filterCategorie}
          onToggle={toggleFilterCategorie}
          darkMode
        />
      )}
      <div className="mb-3">
        <label
          className="text-xs font-semibold block mb-1.5"
          style={{ color: "#5C4A28" }}
        >
          Minimale beoordeling
        </label>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r === filterRating ? 0 : r)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor:
                  filterRating === r && r > 0 ? "#3D2E14" : "#FFFFFF",
                color: filterRating === r && r > 0 ? "#FFFFFF" : "#5C4A28",
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
      {sortedDoelgroepen.length > 0 && (
        <FilterChipRow
          label="Doelgroep"
          items={sortedDoelgroepen}
          selected={filterDoelgroep}
          onToggle={toggleFilterDoelgroep}
          darkMode
        />
      )}
      {sortedTypes.length > 0 && (
        <FilterChipRow
          label="Type"
          items={sortedTypes}
          selected={filterAnaloog}
          onToggle={toggleFilterAnaloog}
          darkMode
        />
      )}
      {sortedPlaatsTijd.length > 0 && (
        <FilterChipRow
          label="Locatie"
          items={sortedPlaatsTijd}
          selected={filterPlaats}
          onToggle={toggleFilterPlaats}
          darkMode
        />
      )}
      <button
        onClick={onFilteredRandom}
        className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
        style={{
          backgroundColor: hasAnyFilterSelected ? "#3D2E14" : "#BBAC8F",
          color: "#FFFFFF",
          cursor: hasAnyFilterSelected ? "pointer" : "default",
          border: "none",
        }}
      >
        <Dice5 size={16} />🎲 Gooi de dobbelsteen!
      </button>
      {noResult && (
        <p className="text-sm mt-2 text-center" style={{ color: "#B91C1C" }}>
          Geen werkvorm gevonden die voldoet aan deze filters.
        </p>
      )}
    </div>
  );
}

function FilterChipRow({ label, items, selected, onToggle, darkMode }) {
  return (
    <div className="mb-3">
      <label
        className="text-xs font-semibold block mb-1.5"
        style={{ color: darkMode ? "#5C4A28" : "#555" }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                backgroundColor: isActive
                  ? darkMode
                    ? "#3D2E14"
                    : "#143d2f"
                  : "#FFFFFF",
                color: isActive ? "#FFFFFF" : darkMode ? "#5C4A28" : "#555",
                border: isActive
                  ? darkMode
                    ? "1px solid #3D2E14"
                    : "1px solid #143d2f"
                  : "1px solid rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
