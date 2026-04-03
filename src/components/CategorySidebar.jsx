import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  BookOpen,
  List,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Layers,
  Bot,
  User,
} from "lucide-react";
import { RichText } from "./Content/RichText";

export function CategorySidebar({
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
  isLoading,
  error,
  showIntro,
  onShowIntro,
  showAuthor,
  onShowAuthor,
  hasAuthor,
  edited,
  images,
}) {
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const isAllePromptsActive =
    !showIntro &&
    !showAuthor &&
    !selectedSection &&
    (selectedCategory === "Alle prompts" || !selectedCategory);

  return (
    <aside
      className="hidden md:flex flex-col w-[300px] flex-shrink-0"
      style={{
        backgroundColor: "#1d4a3c",
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

            {/* Alle prompts */}
            <SidebarButton
              icon={<List size={16} style={{ opacity: 0.7 }} />}
              label="Alle prompts"
              isActive={isAllePromptsActive}
              onClick={() => onSelectCategory("Alle prompts")}
              count={prompts ? prompts.length : 0}
              bold
            />

            <Divider />

            {/* Secties dropdown */}
            {sectionOrder && sectionOrder.length > 0 && (
              <DropdownSection
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
                    <SidebarButton
                      key={sectionName}
                      label={sectionName}
                      isActive={isActive}
                      onClick={() => onSelectSection(sectionName)}
                      count={promptCount}
                      indent
                    />
                  );
                })}
              </DropdownSection>
            )}

            {/* Categorieën dropdown */}
            {categories && categories.length > 0 && (
              <DropdownSection
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
                      <SidebarButton
                        key={cat}
                        label={cat}
                        isActive={isActive}
                        onClick={() => onSelectCategory(cat)}
                        count={promptCount}
                        indent
                      />
                    );
                  })}
              </DropdownSection>
            )}

            {/* Specifiek voor chatbot dropdown */}
            {chatbotModels && chatbotModels.length > 0 && (
              <DropdownSection
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
                    <SidebarButton
                      key={model}
                      label={model}
                      isActive={isActive}
                      onClick={() => onSelectChatbot(isActive ? null : model)}
                      count={promptCount}
                      indent
                    />
                  );
                })}
              </DropdownSection>
            )}

            {/* Edited section content */}
            {edited && edited.content && edited.content.length > 0 && (
              <>
                <Divider />
                <div
                  style={{
                    padding: "12px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {edited.content.map((item, idx) => {
                    if (!item.parts || item.parts.length === 0) return null;
                    return (
                      <p key={idx} style={{ margin: "0 0 8px 0" }}>
                        <RichText parts={item.parts} images={images} />
                      </p>
                    );
                  })}
                </div>
              </>
            )}
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

function DropdownSection({ icon, title, isOpen, onToggle, children }) {
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
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
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

function SidebarButton({
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
