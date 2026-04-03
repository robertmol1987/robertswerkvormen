import { useState } from "react";
import { Search } from "lucide-react";
import { SearchAndSort } from "../components/SearchAndSort";
import { CategoryGroupSection } from "../components/CategoryGroupSection";
import { ToolCard } from "../components/ToolCard";
import { useToolFiltering } from "../hooks/useToolFiltering";
import { useToolSorting } from "../hooks/useToolSorting";
import { useCategoryGroups } from "../hooks/useCategoryGroups";
import { getFilterSummary, hasActiveFilters } from "../utils/filterHelpers";

export function CardGridView({
  tools,
  categoryTitle,
  categoryDescription,
  categories,
  categoryDescriptions,
  images,
  goalFilter,
  tagFilter,
  doelgroepFilter,
  analoogDigitaalFilter,
  plaatsTijdFilter,
  favorietFilter,
  onSelectTool,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name" | "rating"

  const filtered = useToolFiltering(
    tools,
    searchQuery,
    goalFilter,
    tagFilter,
    doelgroepFilter,
    analoogDigitaalFilter,
    plaatsTijdFilter,
    favorietFilter,
  );

  const sorted = useToolSorting(filtered, sortBy);

  const shouldGroupByCategory = !categoryTitle;

  const categoryGroups = useCategoryGroups(
    shouldGroupByCategory,
    categories,
    categoryDescriptions,
    sorted,
  );

  const title = categoryTitle || "Alle werkvormen";

  const handleToggleSort = () => {
    if (sortBy === "name") {
      setSortBy("rating");
    } else {
      setSortBy("name");
    }
  };

  const hasFilters = hasActiveFilters(
    searchQuery,
    goalFilter,
    tagFilter,
    doelgroepFilter,
    analoogDigitaalFilter,
    plaatsTijdFilter,
  );

  const filterSummary = getFilterSummary(
    searchQuery,
    goalFilter,
    tagFilter,
    doelgroepFilter,
    analoogDigitaalFilter,
    plaatsTijdFilter,
  );

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="p-8 pt-6">
        {/* Search + sort row */}
        <SearchAndSort
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          onToggleSort={handleToggleSort}
        />

        {/* Title + count + description */}
        <div className="mb-4">
          <h2
            className="font-bold mb-1"
            style={{ fontSize: "24px", color: "#1A1A1A" }}
          >
            {title}{" "}
            <span style={{ fontSize: "15px", fontWeight: 400, color: "#888" }}>
              ({sorted.length} werkvormen)
            </span>
          </h2>
          {categoryDescription && (
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#555",
                whiteSpace: "pre-wrap",
                marginBottom: "4px",
              }}
            >
              {categoryDescription}
            </p>
          )}
          {hasFilters && (
            <p className="text-sm" style={{ color: "#888" }}>
              {filterSummary}
            </p>
          )}
        </div>

        {/* === GROUPED BY CATEGORY (Alle werkvormen view) === */}
        {shouldGroupByCategory && categoryGroups ? (
          categoryGroups.map((group) => (
            <CategoryGroupSection
              key={group.category}
              group={group}
              sortBy={sortBy}
              images={images}
              onSelectTool={onSelectTool}
            />
          ))
        ) : (
          /* === FLAT GRID (single category view) === */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(308px, 1fr))",
              gap: "16px",
              maxWidth: "1456px",
            }}
          >
            {sorted.map((tool, idx) => (
              <ToolCard
                key={idx}
                tool={tool}
                images={images}
                onSelectTool={onSelectTool}
              />
            ))}
          </div>
        )}

        {sorted.length === 0 && (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <Search size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p className="text-sm">Geen werkvormen gevonden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
