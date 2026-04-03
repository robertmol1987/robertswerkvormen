import { useState, useCallback } from "react";
import { Copy, Eye, Check, Search, Tag, X } from "lucide-react";
import { PromptDetailModal } from "./PromptDetailModal";

export function PromptList({ prompts, categoryTitle, sectionTitle }) {
  const [copiedId, setCopiedId] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = useCallback(async (prompt) => {
    const fullText = prompt.name + "\n\n" + prompt.promptText;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(prompt.name);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const filteredPrompts = prompts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesName = p.name.toLowerCase().includes(q);
    const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = p.categories.some((c) =>
      c.toLowerCase().includes(q),
    );
    return matchesName || matchesTags || matchesCategory;
  });

  const title = sectionTitle || categoryTitle || "Alle prompts";

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="p-8 pt-6" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="mb-6">
          <h2
            className="font-bold mb-1"
            style={{ fontSize: "24px", color: "#1A1A1A" }}
          >
            {title}
          </h2>
          <p className="text-sm" style={{ color: "#888" }}>
            {filteredPrompts.length}{" "}
            {filteredPrompts.length === 1 ? "prompt" : "prompts"}
            {searchQuery && ` gevonden voor "${searchQuery}"`}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#999" }}
          />
          <input
            type="text"
            placeholder="Zoek op naam of tag..."
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
              e.currentTarget.style.borderColor = "#1d4a3c";
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

        {/* Prompt list */}
        <div className="flex flex-col gap-2">
          {filteredPrompts.map((prompt, idx) => {
            const isCopied = copiedId === prompt.name;
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #EEEEEE",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F7F4";
                  e.currentTarget.style.borderColor = "#1d4a3c40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAFAFA";
                  e.currentTarget.style.borderColor = "#EEEEEE";
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium truncate"
                    style={{ fontSize: "15px", color: "#1A1A1A" }}
                  >
                    <span
                      style={{
                        color: "#999",
                        marginRight: "8px",
                        fontSize: "13px",
                      }}
                    >
                      {idx + 1}.
                    </span>
                    {prompt.name}
                  </div>
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <Tag size={11} style={{ color: "#999", flexShrink: 0 }} />
                      {prompt.tags.slice(0, 4).map((tag, tidx) => (
                        <span
                          key={tidx}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "#E8F0EC",
                            color: "#1d4a3c",
                            fontSize: "11px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 4 && (
                        <span className="text-xs" style={{ color: "#999" }}>
                          +{prompt.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="p-2 rounded-md transition-all"
                    style={{
                      color: isCopied ? "#16a34a" : "#666",
                      backgroundColor: isCopied ? "#dcfce7" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCopied)
                        e.currentTarget.style.backgroundColor = "#E8F0EC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isCopied)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title="Kopieer prompt"
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>

                  {/* View button */}
                  <button
                    onClick={() => setViewingPrompt(prompt)}
                    className="p-2 rounded-md transition-all"
                    style={{ color: "#666" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#E8F0EC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title="Bekijk prompt"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12" style={{ color: "#999" }}>
              <Search
                size={32}
                style={{ margin: "0 auto 12px", opacity: 0.3 }}
              />
              <p className="text-sm">Geen prompts gevonden.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {viewingPrompt && (
        <PromptDetailModal
          prompt={viewingPrompt}
          onClose={() => setViewingPrompt(null)}
          onCopy={() => handleCopy(viewingPrompt)}
          isCopied={copiedId === viewingPrompt.name}
        />
      )}
    </div>
  );
}
