import { useState } from "react";
import {
  BookOpen,
  List,
  User,
  Layers,
  ExternalLink,
  Target,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export function MobileToolboxSidebar({
  categories,
  tools,
  selectedCategory,
  onSelectCategory,
  isOpen,
  onClose,
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
  const [showAuthorLinks, setShowAuthorLinks] = useState(false);

  if (!isOpen) return null;

  const isAlleWerkvormenActive =
    !showIntro &&
    !showAuthor &&
    !showGoals &&
    !showTrainingen &&
    !showGenereerWerkvorm &&
    !selectedCategory;
  const hasLinks = authorLinks && authorLinks.length > 0;

  // Count werkvormen per category
  const getCategoryCount = (cat) => {
    if (!tools) return 0;
    return tools.filter(
      (t) =>
        t.categories &&
        t.categories.some((c) => c.toLowerCase() === cat.toLowerCase()),
    ).length;
  };

  return (
    <>
      <div
        className="md:hidden fixed inset-0 z-30 bg-black/50"
        onClick={onClose}
      />
      <aside
        className="md:hidden sidebar-slide fixed left-0 bottom-0 w-[280px] z-40 overflow-y-auto"
        style={{
          backgroundColor: "#143d2f",
          overflowX: "hidden",
          top: "120px",
        }}
      >
        <div className="p-4 pt-3">
          {/* Welkom! */}
          <MobileSidebarButton
            icon={<BookOpen size={16} style={{ opacity: 0.7 }} />}
            label="Welkom!"
            isActive={showIntro}
            onClick={() => {
              onShowIntro();
              onClose();
            }}
            bold
          />

          {/* Over de auteur */}
          {hasAuthor && (
            <MobileSidebarButton
              icon={<User size={16} style={{ opacity: 0.7 }} />}
              label="Over de auteur"
              isActive={showAuthor}
              onClick={() => {
                onShowAuthor();
                onClose();
              }}
              bold
            />
          )}

          {/* Ook van deze auteur */}
          {hasLinks && (
            <button
              onClick={() => setShowAuthorLinks(!showAuthorLinks)}
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

          {/* Inline links */}
          {showAuthorLinks && hasLinks && (
            <div style={{ paddingLeft: "12px", paddingBottom: "4px" }}>
              {authorLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  title={link.label}
                  className="block py-1.5 px-3 rounded-lg transition-all"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Trainingen */}
          {hasTrainingen && (
            <MobileSidebarButton
              icon={<GraduationCap size={16} style={{ opacity: 0.7 }} />}
              label="Trainingen"
              isActive={showTrainingen}
              onClick={() => {
                onShowTrainingen();
                onClose();
              }}
              bold
            />
          )}

          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
              margin: "6px 0",
            }}
          />

          {/* Alle werkvormen */}
          <MobileSidebarButton
            icon={<List size={16} style={{ opacity: 0.7 }} />}
            label="Alle werkvormen"
            isActive={isAlleWerkvormenActive}
            onClick={() => {
              onSelectCategory(null);
              onClose();
            }}
            count={tools ? tools.length : 0}
            bold
          />

          {/* Genereer een unieke werkvorm */}
          {hasGenereerWerkvorm && (
            <MobileSidebarButton
              icon={<Sparkles size={16} style={{ opacity: 0.7 }} />}
              label="Genereer een werkvorm"
              isActive={showGenereerWerkvorm}
              onClick={() => {
                onShowGenereerWerkvorm();
                onClose();
              }}
              bold
            />
          )}

          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
              margin: "6px 0",
            }}
          />

          {/* Categories */}
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
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
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
                >
                  <span className="flex items-center gap-2 flex-1 min-w-0">
                    <Layers size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
                    <span style={{ wordBreak: "break-word", lineHeight: 1.4 }}>
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
        </div>
      </aside>
    </>
  );
}

function MobileSidebarButton({ icon, label, isActive, onClick, count, bold }) {
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
