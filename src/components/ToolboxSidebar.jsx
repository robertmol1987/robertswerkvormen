import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Loader2,
  AlertCircle,
  BookOpen,
  List,
  User,
  Layers,
  ExternalLink,
  Target,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export function ToolboxSidebar({
  categories,
  tools,
  selectedCategory,
  onSelectCategory,
  isLoading,
  error,
  showIntro,
  onShowIntro,
  showAuthor,
  onShowAuthor,
  hasAuthor,
  authorLinks,
  showGoals,
  onShowGoals,
  allGoals,
  showTrainingen,
  onShowTrainingen,
  hasTrainingen,
  showGenereerWerkvorm,
  onShowGenereerWerkvorm,
  hasGenereerWerkvorm,
}) {
  const isAlleWerkvormenActive =
    !showIntro &&
    !showAuthor &&
    !showGoals &&
    !showTrainingen &&
    !showGenereerWerkvorm &&
    !selectedCategory;
  const [showAuthorLinks, setShowAuthorLinks] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const flyoutRef = useRef(null);
  const buttonRef = useRef(null);

  const hasLinks = authorLinks && authorLinks.length > 0;

  const toggleAuthorLinks = () => {
    if (!showAuthorLinks && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setFlyoutPos({
        top: rect.top,
        left: rect.right + 8,
      });
    }
    setShowAuthorLinks(!showAuthorLinks);
  };

  useEffect(() => {
    if (!showAuthorLinks) return;
    const handleClick = (e) => {
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowAuthorLinks(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAuthorLinks]);

  // Count werkvormen per category (a werkvorm can belong to multiple categories)
  const getCategoryCount = (cat) => {
    if (!tools) return 0;
    return tools.filter(
      (t) =>
        t.categories &&
        t.categories.some((c) => c.toLowerCase() === cat.toLowerCase()),
    ).length;
  };

  return (
    <aside
      className="hidden md:flex flex-col w-[300px] flex-shrink-0"
      style={{
        backgroundColor: "#143d2f",
        borderRight: "4px solid rgba(255,255,255,0.1)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="p-4 pt-3">
        {isLoading && (
          <div
            className="flex items-center gap-2 py-8 justify-center"
            style={{ color: "#DADADA" }}
          >
            <Loader2 size={18} className="loader-spin" />
            <span className="text-sm">Laden…</span>
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-2 py-4 px-3"
            style={{ color: "#ff8888" }}
          >
            <AlertCircle size={16} />
            <span className="text-sm">Kon document niet laden</span>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Welkom! */}
            <SidebarButton
              icon={<BookOpen size={16} style={{ opacity: 0.7 }} />}
              label="Welkom!"
              isActive={showIntro}
              onClick={onShowIntro}
              bold
            />

            {/* Over de auteur */}
            {hasAuthor && (
              <SidebarButton
                icon={<User size={16} style={{ opacity: 0.7 }} />}
                label="Over de auteur"
                isActive={showAuthor}
                onClick={onShowAuthor}
                bold
              />
            )}

            {/* Ook van deze auteur */}
            {hasLinks && (
              <button
                ref={buttonRef}
                onClick={toggleAuthorLinks}
                className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: showAuthorLinks
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                  color: showAuthorLinks ? "#FFFFFF" : "rgba(255,255,255,0.75)",
                  borderLeft: showAuthorLinks
                    ? "3px solid #D4A843"
                    : "3px solid transparent",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  if (!showAuthorLinks)
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!showAuthorLinks)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="flex items-center gap-2"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <ExternalLink
                    size={16}
                    style={{ opacity: 0.7, flexShrink: 0 }}
                  />
                  <span style={{ wordBreak: "break-word" }}>
                    Ook van deze auteur
                  </span>
                </span>
              </button>
            )}

            {/* Flyout via portal */}
            {showAuthorLinks &&
              hasLinks &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  ref={flyoutRef}
                  style={{
                    position: "fixed",
                    top: flyoutPos.top + "px",
                    left: flyoutPos.left + "px",
                    backgroundColor: "#1a4a38",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    padding: "8px 0",
                    minWidth: "220px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    zIndex: 9999,
                  }}
                >
                  {authorLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      title={link.label}
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "rgba(255,255,255,0.85)",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>,
                document.body,
              )}

            {/* Trainingen */}
            {hasTrainingen && (
              <SidebarButton
                icon={<GraduationCap size={16} style={{ opacity: 0.7 }} />}
                label="Trainingen"
                isActive={showTrainingen}
                onClick={onShowTrainingen}
                bold
              />
            )}

            <Divider />

            {/* Alle werkvormen */}
            <SidebarButton
              icon={<List size={16} style={{ opacity: 0.7 }} />}
              label="Alle werkvormen"
              isActive={isAlleWerkvormenActive}
              onClick={() => onSelectCategory(null)}
              count={tools ? tools.length : 0}
              bold
            />

            {/* Genereer een unieke werkvorm */}
            {hasGenereerWerkvorm && (
              <SidebarButton
                icon={<Sparkles size={16} style={{ opacity: 0.7 }} />}
                label="Genereer een werkvorm"
                isActive={showGenereerWerkvorm}
                onClick={onShowGenereerWerkvorm}
                bold
              />
            )}

            <Divider />

            {/* Categories from werkvormen */}
            {categories &&
              categories.map((cat) => {
                const catCount = getCategoryCount(cat);
                const isCategoryActive =
                  !showIntro &&
                  !showAuthor &&
                  !showGoals &&
                  !showTrainingen &&
                  !showGenereerWerkvorm &&
                  selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all mb-0.5"
                    style={{
                      backgroundColor: isCategoryActive
                        ? "rgba(255,255,255,0.12)"
                        : "transparent",
                      color: isCategoryActive
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.85)",
                      borderLeft: isCategoryActive
                        ? "3px solid #D4A843"
                        : "3px solid transparent",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => {
                      if (!isCategoryActive)
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isCategoryActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span className="flex items-center gap-2 flex-1 min-w-0">
                      <Layers
                        size={14}
                        style={{ opacity: 0.6, flexShrink: 0 }}
                      />
                      <span
                        style={{ wordBreak: "break-word", lineHeight: 1.4 }}
                      >
                        {cat}
                      </span>
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {catCount}
                    </span>
                  </button>
                );
              })}
          </>
        )}
      </div>
    </aside>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: "1px",
        backgroundColor: "rgba(255,255,255,0.1)",
        margin: "6px 0",
      }}
    />
  );
}

function SidebarButton({ icon, label, isActive, onClick, count, bold }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all"
      style={{
        backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.75)",
        borderLeft: isActive ? "3px solid #D4A843" : "3px solid transparent",
        fontSize: "14px",
        fontWeight: bold ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span
        className="flex items-center gap-2"
        style={{ flex: 1, minWidth: 0 }}
      >
        {icon}
        <span style={{ wordBreak: "break-word" }}>{label}</span>
      </span>
      {count !== undefined && (
        <span
          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
