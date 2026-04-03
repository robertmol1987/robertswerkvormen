import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAndParseDocx } from "@/utils/docx/docxParser";
import { parseToolboxLibrary } from "@/utils/docx/toolboxParser";
import { Header } from "@/components/Header/Header";
import { ToolboxSidebar } from "@/components/ToolboxSidebar";
import { MobileToolboxSidebar } from "@/components/MobileToolboxSidebar";
import { ToolDetail } from "@/components/ToolDetail";
import { DetailView } from "@/components/ToolDetail/views/DetailView";
import { IntroductionPage } from "@/components/IntroductionPage";
import { LandingScreen } from "@/components/LandingScreen";
import { GoalBar } from "@/components/GoalBar";
import { GenereerWerkvormPage } from "@/components/GenereerWerkvormPage";
import { ActionBar } from "@/components/ActionBar";
import { ArrowLeft, X } from "lucide-react";
import { playCardOpen, playCardClose } from "@/utils/sounds";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [modalFromDice, setModalFromDice] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showAuthor, setShowAuthor] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showTrainingen, setShowTrainingen] = useState(false);
  const [showGenereerWerkvorm, setShowGenereerWerkvorm] = useState(false);
  const [goalFilter, setGoalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState([]);
  const [doelgroepFilter, setDoelgroepFilter] = useState([]);
  const [analoogDigitaalFilter, setAnaloogDigitaalFilter] = useState([]);
  const [plaatsTijdFilter, setPlaatsTijdFilter] = useState([]);
  const [favorietFilter, setFavorietFilter] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedTool) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTool]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["docx-content"],
    queryFn: fetchAndParseDocx,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const sections = data?.sections;
  const images = data?.images || {};
  const auteurSections = data?.auteurSections;

  const library = useMemo(() => {
    if (!sections) return null;
    return parseToolboxLibrary(sections, auteurSections);
  }, [sections, auteurSections]);

  const werkvormCategories = useMemo(() => {
    if (!library) return [];
    const catSet = new Set();
    for (const wv of library.tools) {
      if (wv.categories && wv.categories.length > 0) {
        for (const c of wv.categories) {
          catSet.add(c);
        }
      }
    }
    return Array.from(catSet).sort((a, b) => a.localeCompare(b, "nl"));
  }, [library]);

  const visibleTools = useMemo(() => {
    if (!library) return [];
    return library.tools;
  }, [library]);

  const hasActiveFilter =
    goalFilter ||
    tagFilter.length > 0 ||
    doelgroepFilter.length > 0 ||
    analoogDigitaalFilter.length > 0 ||
    plaatsTijdFilter.length > 0 ||
    favorietFilter;

  const filteredTools = useMemo(() => {
    if (!library) return [];
    let result = visibleTools;
    if (selectedCategory) {
      result = result.filter(
        (t) =>
          t.categories &&
          t.categories.some(
            (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
          ),
      );
    }
    return result;
  }, [library, selectedCategory, visibleTools]);

  const clearAllViews = () => {
    setShowIntro(false);
    setShowAuthor(false);
    setShowGoals(false);
    setShowTrainingen(false);
    setShowGenereerWerkvorm(false);
  };

  const closeModal = () => {
    if (selectedTool) playCardClose();
    setSelectedTool(null);
    setModalFromDice(false);
    if (modalFromDice) {
      setSelectedCategory(null);
      clearAllViews();
    }
  };

  const handleSelectToolFromDice = (tool) => {
    setSelectedTool(tool);
    setModalFromDice(true);
    if (tool) {
      clearAllViews();
      playCardOpen();
    }
  };

  const handleGoalFilterChange = (value) => {
    setGoalFilter(value);
    if (value && !selectedCategory) {
      setSelectedTool(null);
      clearAllViews();
    }
  };

  const handleTagFilterChange = (newTags) => {
    setTagFilter(newTags);
    if (newTags.length > 0 && !selectedCategory) {
      setSelectedTool(null);
      clearAllViews();
    }
  };

  const handleDoelgroepFilterChange = (newDoelgroepen) => {
    setDoelgroepFilter(newDoelgroepen);
    if (newDoelgroepen.length > 0 && showIntro) {
      setShowIntro(false);
    }
  };

  const handleAnaloogDigitaalFilterChange = (newValues) => {
    setAnaloogDigitaalFilter(newValues);
    if (newValues.length > 0 && showIntro) {
      setShowIntro(false);
    }
  };

  const handlePlaatsTijdFilterChange = (newValues) => {
    setPlaatsTijdFilter(newValues);
    if (newValues.length > 0 && showIntro) {
      setShowIntro(false);
    }
  };

  const handleFavorietFilterChange = (val) => {
    setFavorietFilter(val);
    if (val && showIntro) {
      setShowIntro(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedTool(null);
    clearAllViews();
    setSidebarOpen(false);
  };

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
    if (tool) {
      clearAllViews();
      playCardOpen();
    }
  };

  const handleShowIntro = () => {
    clearAllViews();
    setShowIntro(true);
    setSelectedCategory(null);
    setSelectedTool(null);
  };

  const dismissLanding = () => {
    setShowLanding(false);
  };

  const handleShowAuthor = () => {
    clearAllViews();
    setShowAuthor(true);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSidebarOpen(false);
  };

  const handleShowGoals = () => {
    clearAllViews();
    setShowGoals(true);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSidebarOpen(false);
  };

  const handleShowTrainingen = () => {
    clearAllViews();
    setShowTrainingen(true);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSidebarOpen(false);
  };

  const handleShowGenereerWerkvorm = () => {
    clearAllViews();
    setShowGenereerWerkvorm(true);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSidebarOpen(false);
  };

  const handleGoalCardClick = (goal) => {
    setGoalFilter(goal);
    clearAllViews();
    setSelectedCategory(null);
    setSelectedTool(null);
  };

  const isShowingToolDetail =
    !showIntro &&
    !showAuthor &&
    !showTrainingen &&
    !showGoals &&
    !showGenereerWerkvorm;

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: "#143d2f",
        fontFamily: "Work Sans, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .page-fade { animation: fadeIn 300ms ease-out; }
        .sidebar-slide { animation: slideIn 250ms ease-out; }
        .loader-spin { animation: spin 1s linear infinite; }
        .modal-slide-in { animation: modalSlideIn 0.25s ease-out; }
      `}</style>

      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        pageTitle={library?.pageTitle || ""}
        pageSubtitle={library?.pageSubtitle || ""}
        onShowLanding={() => setShowLanding(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <ToolboxSidebar
          categories={werkvormCategories}
          tools={visibleTools}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          isLoading={isLoading}
          error={error}
          showIntro={showIntro}
          onShowIntro={handleShowIntro}
          showAuthor={showAuthor}
          onShowAuthor={handleShowAuthor}
          hasAuthor={!!library?.overDeAuteur}
          authorLinks={library?.ookVanDezeAuteur || []}
          showGoals={showGoals}
          onShowGoals={handleShowGoals}
          showTrainingen={showTrainingen}
          onShowTrainingen={handleShowTrainingen}
          hasTrainingen={!!library?.trainingen}
          allGoals={library?.allGoals || []}
          showGenereerWerkvorm={showGenereerWerkvorm}
          onShowGenereerWerkvorm={handleShowGenereerWerkvorm}
          hasGenereerWerkvorm={!!library?.genereerWerkvorm}
        />

        <MobileToolboxSidebar
          categories={werkvormCategories}
          tools={visibleTools}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          showIntro={showIntro}
          onShowIntro={handleShowIntro}
          showAuthor={showAuthor}
          onShowAuthor={handleShowAuthor}
          hasAuthor={!!library?.overDeAuteur}
          authorLinks={library?.ookVanDezeAuteur || []}
          showGoals={showGoals}
          onShowGoals={handleShowGoals}
          showTrainingen={showTrainingen}
          onShowTrainingen={handleShowTrainingen}
          hasTrainingen={!!library?.trainingen}
          allGoals={library?.allGoals || []}
          showGenereerWerkvorm={showGenereerWerkvorm}
          onShowGenereerWerkvorm={handleShowGenereerWerkvorm}
          hasGenereerWerkvorm={!!library?.genereerWerkvorm}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          {library && (
            <GoalBar
              allGoals={library.allGoals || []}
              goalFilter={goalFilter}
              onGoalFilterChange={handleGoalFilterChange}
              allTags={library.allTags || []}
              tagFilter={tagFilter}
              onTagFilterChange={handleTagFilterChange}
              allDoelgroepen={library.allDoelgroepen || []}
              doelgroepFilter={doelgroepFilter}
              onDoelgroepFilterChange={handleDoelgroepFilterChange}
              allAnaloogDigitaal={library.allAnaloogDigitaal || []}
              analoogDigitaalFilter={analoogDigitaalFilter}
              onAnaloogDigitaalFilterChange={handleAnaloogDigitaalFilterChange}
              allPlaatsTijd={library.allPlaatsTijd || []}
              plaatsTijdFilter={plaatsTijdFilter}
              onPlaatsTijdFilterChange={handlePlaatsTijdFilterChange}
              favorietFilter={favorietFilter}
              onFavorietFilterChange={handleFavorietFilterChange}
            />
          )}

          {library && (
            <ActionBar
              tools={visibleTools}
              onSelectTool={handleSelectToolFromDice}
              onShowGenereer={handleShowGenereerWerkvorm}
              onShowAlleWerkvormen={() => handleSelectCategory(null)}
              allGoals={library.allGoals || []}
              allDoelgroepen={library.allDoelgroepen || []}
              allAnaloogDigitaal={library.allAnaloogDigitaal || []}
              allPlaatsTijd={library.allPlaatsTijd || []}
              allCategories={werkvormCategories}
              images={images}
            />
          )}

          {showIntro ? (
            <IntroductionPage
              section={library?.introduction}
              images={images}
              showActionButtons={true}
              tools={visibleTools}
              onSelectTool={handleSelectTool}
              onShowGenereer={handleShowGenereerWerkvorm}
              onShowAlleWerkvormen={() => handleSelectCategory(null)}
              allDoelgroepen={library?.allDoelgroepen || []}
              allAnaloogDigitaal={library?.allAnaloogDigitaal || []}
              allPlaatsTijd={library?.allPlaatsTijd || []}
              allGoals={library?.allGoals || []}
              allCategories={werkvormCategories}
            />
          ) : showAuthor ? (
            <IntroductionPage section={library?.overDeAuteur} images={images} />
          ) : showTrainingen ? (
            <IntroductionPage section={library?.trainingen} images={images} />
          ) : showGenereerWerkvorm ? (
            <GenereerWerkvormPage
              section={library?.genereerWerkvorm}
              images={images}
            />
          ) : showGoals ? (
            <ToolDetail
              tools={visibleTools}
              selectedTool={null}
              onSelectTool={handleSelectTool}
              categoryTitle={null}
              categoryDescription=""
              categories={werkvormCategories}
              categoryDescriptions={library?.categoryDescriptions || {}}
              images={images}
              allGoals={library?.allGoals || []}
              goalFilter={goalFilter}
              onGoalFilterChange={handleGoalFilterChange}
              tagFilter={tagFilter}
              doelgroepFilter={doelgroepFilter}
              analoogDigitaalFilter={analoogDigitaalFilter}
              plaatsTijdFilter={plaatsTijdFilter}
              favorietFilter={favorietFilter}
              showGoalsView={true}
              onGoalCardClick={handleGoalCardClick}
            />
          ) : (
            <ToolDetail
              tools={filteredTools}
              selectedTool={null}
              onSelectTool={handleSelectTool}
              categoryTitle={selectedCategory}
              categoryDescription={
                library?.categoryDescriptions?.[selectedCategory] || ""
              }
              categories={werkvormCategories}
              categoryDescriptions={library?.categoryDescriptions || {}}
              images={images}
              allGoals={library?.allGoals || []}
              goalFilter={goalFilter}
              onGoalFilterChange={handleGoalFilterChange}
              tagFilter={tagFilter}
              doelgroepFilter={doelgroepFilter}
              analoogDigitaalFilter={analoogDigitaalFilter}
              plaatsTijdFilter={plaatsTijdFilter}
              favorietFilter={favorietFilter}
            />
          )}
        </div>
      </div>

      {selectedTool && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 8000,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-slide-in"
            style={{
              width: "70vw",
              height: "90vh",
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid #E5E7EB",
                flexShrink: 0,
                backgroundColor: "#FAFBFC",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#143d2f",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E8F0EC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ArrowLeft size={16} />
                {modalFromDice ? "Alle werkvormen" : "Ga terug"}
              </button>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#555",
                  maxWidth: "40%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedTool.name}
              </span>

              <button
                onClick={closeModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              <DetailView
                selectedTool={selectedTool}
                images={images}
                onSelectTool={handleSelectTool}
                hideBackButton
              />
            </div>
          </div>
        </div>
      )}

      {showLanding && library && (
        <LandingScreen
          tools={visibleTools}
          onSelectTool={(tool) => {
            dismissLanding();
            handleSelectToolFromDice(tool);
          }}
          onShowGenereer={() => {
            dismissLanding();
            handleShowGenereerWerkvorm();
          }}
          onShowAlleWerkvormen={() => {
            dismissLanding();
            clearAllViews();
            setSelectedCategory(null);
            setSelectedTool(null);
          }}
          onDismiss={dismissLanding}
          allDoelgroepen={library?.allDoelgroepen || []}
          allAnaloogDigitaal={library?.allAnaloogDigitaal || []}
          allPlaatsTijd={library?.allPlaatsTijd || []}
          allGoals={library?.allGoals || []}
          allCategories={werkvormCategories}
          images={images}
        />
      )}
    </div>
  );
}
