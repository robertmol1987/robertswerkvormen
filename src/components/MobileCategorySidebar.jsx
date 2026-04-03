import { useState } from "react";
import {
  BookOpen,
  List,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Layers,
  Bot,
  User,
} from "lucide-react";

export function MobileCategorySidebar({
  categories,
  sectionOrder,
  chatbotModels,
  prompts,
  selectedCategory,
  selectedSection,
  selectedChatbot,
  onSelectCategory,
  onSelectSection,
  onSelectChatbot,
  isOpen,
  onClose,
  showIntro,
  onShowIntro,
  showAuthor,
  onShowAuthor,
  hasAuthor,
}) {
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  if (!isOpen) return null;

  const isAllePromptsActive =
    !showIntro &&
    !showAuthor &&
    !selectedSection &&
    (selectedCategory === "Alle prompts" || !selectedCategory);

  return (
    <>
      <div
        className="md:hidden fixed inset-0 z-30 bg-black/50"
        onClick={onClose}
      />
      <aside
        className="md:hidden sidebar-slide fixed left-0 bottom-0 w-[280px] z-40 overflow-y-auto"
        style={{
          backgroundColor: "#1d4a3c",
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

          {/* Alle prompts */}
          <MobileSidebarButton
            icon={<List size={16} style={{ opacity: 0.7 }} />}
            label="Alle prompts"
            isActive={isAllePromptsActive}
            onClick={() => {
              onSelectCategory("Alle prompts");
              onClose();
            }}
            count={prompts ? prompts.length : 0}
            bold
          />

          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
              margin: "6px 0",
            }}
          />

          {/* Secties dropdown */}
          {sectionOrder && sectionOrder.length > 0 && (
            <MobileDropdownSection
              icon={<FolderOpen size={14} style={{ opacity: 0.6 }} />}
              title="Secties"
              isOpen={sectionsOpen}
              onToggle={() => setSectionsOpen(!sectionsOpen)}
            >
              {sectionOrder.map((sectionName) => {
                const isActive = selectedSection === sectionName;
                const promptCount = prompts
                  ? prompts.filter((p) => p.section.includes(sectionName))
                      .length
                  : 0;
                return (
                  <MobileSidebarButton
                    key={sectionName}
                    label={sectionName}
                    isActive={isActive}
                    onClick={() => {
                      onSelectSection(sectionName);
                      onClose();
                    }}
                    count={promptCount}
                    indent
                  />
                );
              })}
            </MobileDropdownSection>
          )}

          {/* Categorieën dropdown */}
          {categories && categories.length > 0 && (
            <MobileDropdownSection
              icon={<Layers size={14} style={{ opacity: 0.6 }} />}
              title="Categorieën"
              isOpen={categoriesOpen}
              onToggle={() => setCategoriesOpen(!categoriesOpen)}
            >
              {categories
                .filter((cat) => cat !== "Alle prompts")
                .map((cat) => {
                  const isActive =
                    !showIntro &&
                    !showAuthor &&
                    !selectedSection &&
                    selectedCategory === cat;
                  const promptCount = prompts
                    ? prompts.filter((p) => p.categories.includes(cat)).length
                    : 0;
                  return (
                    <MobileSidebarButton
                      key={cat}
                      label={cat}
                      isActive={isActive}
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      count={promptCount}
                      indent
                    />
                  );
                })}
            </MobileDropdownSection>
          )}

          {/* Specifiek voor chatbot dropdown */}
          {chatbotModels && chatbotModels.length > 0 && (
            <MobileDropdownSection
              icon={<Bot size={14} style={{ opacity: 0.6 }} />}
              title="Specifiek voor chatbot..."
              isOpen={chatbotOpen}
              onToggle={() => setChatbotOpen(!chatbotOpen)}
            >
              {chatbotModels.map((model) => {
                const isActive = selectedChatbot === model;
                const promptCount = prompts
                  ? prompts.filter((p) => p.taalmodel === model).length
                  : 0;
                return (
                  <MobileSidebarButton
                    key={model}
                    label={model}
                    isActive={isActive}
                    onClick={() => {
                      onSelectChatbot(isActive ? null : model);
                      onClose();
                    }}
                    count={promptCount}
                    indent
                  />
                );
              })}
            </MobileDropdownSection>
          )}
        </div>
      </aside>
    </>
  );
}

function MobileDropdownSection({ icon, title, isOpen, onToggle, children }) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {isOpen ? (
          <ChevronDown size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
        ) : (
          <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
        )}
        {icon}
        {title}
      </button>
      {isOpen && <div className="mt-0.5">{children}</div>}
    </div>
  );
}

function MobileSidebarButton({
  icon,
  label,
  isActive,
  onClick,
  count,
  bold,
  indent,
}) {
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
        paddingLeft: indent ? "28px" : undefined,
      }}
    >
      <span
        className="flex items-center gap-2"
        style={{ flex: 1, minWidth: 0 }}
      >
        {icon}
        <span className="truncate">{label}</span>
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
