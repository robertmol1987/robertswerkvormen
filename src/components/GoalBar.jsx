import { useState } from "react";
import {
  Target,
  Tag,
  Users,
  Monitor,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Heart,
} from "lucide-react";
import {
  sortDoelgroepen,
  sortAnaloogDigitaal,
  sortPlaatsTijd,
} from "@/utils/filterSortOrder";

export function GoalBar({
  allGoals,
  goalFilter,
  onGoalFilterChange,
  allTags,
  tagFilter,
  onTagFilterChange,
  allDoelgroepen,
  doelgroepFilter,
  onDoelgroepFilterChange,
  allAnaloogDigitaal,
  analoogDigitaalFilter,
  onAnaloogDigitaalFilterChange,
  allPlaatsTijd,
  plaatsTijdFilter,
  onPlaatsTijdFilterChange,
  favorietFilter,
  onFavorietFilterChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const handleTagClick = (tag) => {
    if (!onTagFilterChange) return;
    const isActive = tagFilter.includes(tag);
    if (isActive) {
      onTagFilterChange(tagFilter.filter((t) => t !== tag));
    } else {
      onTagFilterChange([...tagFilter, tag]);
    }
  };

  const handleDoelgroepClick = (dg) => {
    if (!onDoelgroepFilterChange) return;
    const isActive = doelgroepFilter && doelgroepFilter.includes(dg);
    if (isActive) {
      onDoelgroepFilterChange(doelgroepFilter.filter((d) => d !== dg));
    } else {
      onDoelgroepFilterChange([...(doelgroepFilter || []), dg]);
    }
  };

  const handleAnaloogDigitaalClick = (ad) => {
    if (!onAnaloogDigitaalFilterChange) return;
    const isActive =
      analoogDigitaalFilter && analoogDigitaalFilter.includes(ad);
    if (isActive) {
      onAnaloogDigitaalFilterChange(
        analoogDigitaalFilter.filter((a) => a !== ad),
      );
    } else {
      onAnaloogDigitaalFilterChange([...(analoogDigitaalFilter || []), ad]);
    }
  };

  const handlePlaatsTijdClick = (pt) => {
    if (!onPlaatsTijdFilterChange) return;
    const isActive = plaatsTijdFilter && plaatsTijdFilter.includes(pt);
    if (isActive) {
      onPlaatsTijdFilterChange(plaatsTijdFilter.filter((p) => p !== pt));
    } else {
      onPlaatsTijdFilterChange([...(plaatsTijdFilter || []), pt]);
    }
  };

  const handleClearAll = () => {
    onGoalFilterChange("");
    if (onTagFilterChange) onTagFilterChange([]);
    if (onDoelgroepFilterChange) onDoelgroepFilterChange([]);
    if (onAnaloogDigitaalFilterChange) onAnaloogDigitaalFilterChange([]);
    if (onPlaatsTijdFilterChange) onPlaatsTijdFilterChange([]);
    if (onFavorietFilterChange) onFavorietFilterChange(false);
  };

  const hasDoelgroepFilter = doelgroepFilter && doelgroepFilter.length > 0;
  const hasAnaloogFilter =
    analoogDigitaalFilter && analoogDigitaalFilter.length > 0;
  const hasPlaatsTijdFilterActive =
    plaatsTijdFilter && plaatsTijdFilter.length > 0;
  const hasTagFilterActive = tagFilter && tagFilter.length > 0;
  const hasAnyFilter =
    goalFilter ||
    hasTagFilterActive ||
    hasDoelgroepFilter ||
    hasAnaloogFilter ||
    hasPlaatsTijdFilterActive ||
    favorietFilter;

  const activeFilterCount =
    (goalFilter ? 1 : 0) +
    (tagFilter ? tagFilter.length : 0) +
    (doelgroepFilter ? doelgroepFilter.length : 0) +
    (analoogDigitaalFilter ? analoogDigitaalFilter.length : 0) +
    (plaatsTijdFilter ? plaatsTijdFilter.length : 0) +
    (favorietFilter ? 1 : 0);

  const sortedDoelgroepen = sortDoelgroepen(allDoelgroepen);
  const sortedAnaloogDigitaal = sortAnaloogDigitaal(allAnaloogDigitaal);
  const sortedPlaatsTijd = sortPlaatsTijd(allPlaatsTijd);

  return (
    <div
      className="flex-shrink-0"
      style={{
        backgroundColor: "#F3F6F4",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      {/* Main row: Doel dropdown + filter toggle */}
      <div className="flex items-center gap-3 px-6 py-3 flex-wrap">
        <Target size={18} style={{ color: "#143d2f", flexShrink: 0 }} />
        <span
          className="text-sm font-medium flex-shrink-0"
          style={{ color: "#555" }}
        >
          Doel
        </span>
        <select
          value={goalFilter}
          onChange={(e) => onGoalFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm appearance-none"
          style={{
            border: "1px solid #D1D5DB",
            outline: "none",
            fontSize: "14px",
            color: goalFilter ? "#333" : "#999",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
            maxWidth: "400px",
            flex: "1 1 200px",
          }}
        >
          <option value="">Welk doel wil je bereiken met een werkvorm?</option>
          {allGoals &&
            allGoals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
        </select>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0"
          style={{
            border: hasAnyFilter ? "1px solid #143d2f" : "1px solid #D1D5DB",
            backgroundColor: hasAnyFilter ? "#E8F0EC" : "#FFFFFF",
            color: hasAnyFilter ? "#143d2f" : "#555",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#143d2f";
            e.currentTarget.style.backgroundColor = "#E8F0EC";
          }}
          onMouseLeave={(e) => {
            if (!hasAnyFilter) {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }
          }}
        >
          Filters
          {activeFilterCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: "#143d2f",
                color: "#FFFFFF",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {activeFilterCount}
            </span>
          )}
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Favoriet van Robert toggle */}
        <button
          onClick={() =>
            onFavorietFilterChange && onFavorietFilterChange(!favorietFilter)
          }
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0"
          style={{
            border: favorietFilter ? "1px solid #E53E3E" : "1px solid #D1D5DB",
            backgroundColor: favorietFilter ? "#FEF2F2" : "#FFFFFF",
            color: favorietFilter ? "#E53E3E" : "#555",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            if (!favorietFilter) {
              e.currentTarget.style.borderColor = "#E53E3E";
              e.currentTarget.style.backgroundColor = "#FEF2F2";
              e.currentTarget.style.color = "#E53E3E";
            }
          }}
          onMouseLeave={(e) => {
            if (!favorietFilter) {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#555";
            }
          }}
        >
          <Heart size={14} fill={favorietFilter ? "#E53E3E" : "none"} />
          Favoriet van Robert
        </button>

        {hasAnyFilter && (
          <button
            onClick={handleClearAll}
            className="text-xs px-2 py-1 rounded transition-all flex-shrink-0"
            style={{
              color: "#143d2f",
              backgroundColor: "#E8F0EC",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d0e4d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E8F0EC";
            }}
          >
            Wis alle filters
          </button>
        )}
      </div>

      {/* Expandable filter rows */}
      {showFilters && (
        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            padding: "12px 24px 16px",
          }}
        >
          {/* Doelgroep filter */}
          {sortedDoelgroepen.length > 0 && (
            <FilterRow
              icon={<Users size={16} style={{ color: "#143d2f" }} />}
              label="Doelgroep"
              items={sortedDoelgroepen}
              activeItems={doelgroepFilter || []}
              onToggle={handleDoelgroepClick}
            />
          )}

          {/* Analoog / Digitaal / AI filter */}
          {sortedAnaloogDigitaal.length > 0 && (
            <FilterRow
              icon={<Monitor size={16} style={{ color: "#143d2f" }} />}
              label="Type"
              items={sortedAnaloogDigitaal}
              activeItems={analoogDigitaalFilter || []}
              onToggle={handleAnaloogDigitaalClick}
            />
          )}

          {/* Plaats- en tijdonafhankelijk filter */}
          {sortedPlaatsTijd.length > 0 && (
            <FilterRow
              icon={<MapPin size={16} style={{ color: "#143d2f" }} />}
              label="Locatie"
              items={sortedPlaatsTijd}
              activeItems={plaatsTijdFilter || []}
              onToggle={handlePlaatsTijdClick}
            />
          )}

          {/* Tag filter */}
          {allTags && allTags.length > 0 && (
            <FilterRow
              icon={<Tag size={16} style={{ color: "#143d2f" }} />}
              label="Tags"
              items={allTags}
              activeItems={tagFilter || []}
              onToggle={handleTagClick}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterRow({ icon, label, items, activeItems, onToggle }) {
  return (
    <div className="flex items-start gap-3 mb-3 last:mb-0">
      <div
        className="flex items-center gap-1.5 flex-shrink-0 pt-1"
        style={{ minWidth: "90px" }}
      >
        {icon}
        <span className="text-sm font-medium" style={{ color: "#555" }}>
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = activeItems.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className="text-sm px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                backgroundColor: isActive ? "#143d2f" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#555",
                border: isActive ? "1px solid #143d2f" : "1px solid #D1D5DB",
                cursor: "pointer",
                fontSize: "12px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#E8F0EC";
                  e.currentTarget.style.borderColor = "#143d2f";
                  e.currentTarget.style.color = "#143d2f";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#555";
                }
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
