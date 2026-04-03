import { Search, X, ArrowUpDown } from "lucide-react";

export function SearchAndSort({
  searchQuery,
  setSearchQuery,
  sortBy,
  onToggleSort,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#999" }}
        />
        <input
          type="text"
          placeholder="Zoek op naam, beschrijving..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
          style={{
            border: "2px solid #E5E7EB",
            outline: "none",
            fontSize: "14px",
            color: "#333",
            backgroundColor: "#FAFAFA",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#143d2f";
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.backgroundColor = "#FAFAFA";
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#999" }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        onClick={onToggleSort}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0"
        style={{
          border: "2px solid #E5E7EB",
          backgroundColor: "#FAFAFA",
          color: "#555",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#143d2f";
          e.currentTarget.style.backgroundColor = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.backgroundColor = "#FAFAFA";
        }}
      >
        <ArrowUpDown size={16} />
        {sortBy === "name" ? "A→Z" : "Beoordeling ↓"}
      </button>
    </div>
  );
}
