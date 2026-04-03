import { useState, useRef, useEffect } from "react";
import { BookContent } from "./Content/BookContent";
import { useRandomTool } from "./IntroductionPage/hooks/useRandomTool";
import { useFilters } from "./IntroductionPage/hooks/useFilters";
import { DiceRollingOverlay } from "./IntroductionPage/components/DiceRollingOverlay";
import { RevealOverlay } from "./IntroductionPage/components/RevealOverlay";
import { ActionCards } from "./IntroductionPage/components/ActionCards";
import { FilterPanel } from "./IntroductionPage/components/FilterPanel";
import { AnimationStyles } from "./IntroductionPage/styles/animations";

export function IntroductionPage({
  section,
  images,
  showActionButtons,
  tools,
  onSelectTool,
  onShowGenereer,
  onShowAlleWerkvormen,
  allDoelgroepen,
  allAnaloogDigitaal,
  allPlaatsTijd,
  allGoals,
  allCategories,
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterCardRef = useRef(null);
  const filterPanelRef = useRef(null);

  const {
    rolling,
    revealTool,
    noResult,
    handleRandomWerkvorm,
    handleRandomFavoriet,
    handleFilteredRandom,
    handleReRoll,
    handleGoToTool,
    handleCloseReveal,
  } = useRandomTool(tools);

  const {
    filterDoelgroep,
    setFilterDoelgroep,
    filterAnaloog,
    setFilterAnaloog,
    filterPlaats,
    setFilterPlaats,
    filterGoal,
    setFilterGoal,
    filterCategorie,
    setFilterCategorie,
    filterRating,
    setFilterRating,
    toggleFilter,
    getFilteredPool,
    hasAnyFilterSelected,
    activeFilterCount,
  } = useFilters();

  // Close filter panel when clicking outside
  useEffect(() => {
    if (!showFilterPanel) return;
    const handleClick = (e) => {
      if (
        filterCardRef.current &&
        !filterCardRef.current.contains(e.target) &&
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target)
      ) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFilterPanel]);

  if (!section) return null;

  // Non-action pages (author, trainingen, etc.)
  if (!showActionButtons) {
    return (
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="p-8 pt-6 page-fade" style={{ maxWidth: "900px" }}>
          <BookContent section={section} images={images} />
        </div>
      </div>
    );
  }

  const handleFilteredRandomClick = () => {
    const filtered = getFilteredPool(tools);
    setShowFilterPanel(false);
    handleFilteredRandom(filtered, onSelectTool);
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Dice rolling overlay */}
      {rolling && <DiceRollingOverlay />}

      {/* Reveal overlay */}
      {revealTool && (
        <RevealOverlay
          tool={revealTool}
          images={images}
          onClose={handleCloseReveal}
          onGoToTool={() => handleGoToTool(revealTool, onSelectTool)}
          onReRoll={() =>
            handleReRoll(() => getFilteredPool(tools), onSelectTool)
          }
        />
      )}

      <div className="page-fade" style={{ padding: "32px" }}>
        {/* Book content from docx */}
        <div style={{ maxWidth: "900px", marginBottom: "48px" }}>
          <BookContent section={section} images={images} />
        </div>

        {/* Action cards section */}
        <div
          style={{
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ActionCards
            onRandomWerkvorm={() => handleRandomWerkvorm(onSelectTool)}
            onRandomFavoriet={() => handleRandomFavoriet(onSelectTool)}
            onShowFilterPanel={() => setShowFilterPanel(!showFilterPanel)}
            onShowGenereer={onShowGenereer}
            onShowAlleWerkvormen={onShowAlleWerkvormen}
            activeFilterCount={activeFilterCount}
            filterCardRef={filterCardRef}
          />
        </div>
      </div>

      {/* Floating filter panel overlay */}
      {showFilterPanel && (
        <FilterPanel
          filterPanelRef={filterPanelRef}
          onClose={() => setShowFilterPanel(false)}
          allGoals={allGoals}
          filterGoal={filterGoal}
          setFilterGoal={setFilterGoal}
          allCategories={allCategories}
          filterCategorie={filterCategorie}
          toggleFilterCategorie={(v) =>
            toggleFilter(filterCategorie, setFilterCategorie, v)
          }
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          allDoelgroepen={allDoelgroepen}
          filterDoelgroep={filterDoelgroep}
          toggleFilterDoelgroep={(v) =>
            toggleFilter(filterDoelgroep, setFilterDoelgroep, v)
          }
          allAnaloogDigitaal={allAnaloogDigitaal}
          filterAnaloog={filterAnaloog}
          toggleFilterAnaloog={(v) =>
            toggleFilter(filterAnaloog, setFilterAnaloog, v)
          }
          allPlaatsTijd={allPlaatsTijd}
          filterPlaats={filterPlaats}
          toggleFilterPlaats={(v) =>
            toggleFilter(filterPlaats, setFilterPlaats, v)
          }
          onFilteredRandom={handleFilteredRandomClick}
          hasAnyFilterSelected={hasAnyFilterSelected}
          noResult={noResult}
        />
      )}

      {/* Backdrop for filter panel */}
      {showFilterPanel && (
        <div
          onClick={() => setShowFilterPanel(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 9997,
          }}
        />
      )}

      <AnimationStyles />
    </div>
  );
}
