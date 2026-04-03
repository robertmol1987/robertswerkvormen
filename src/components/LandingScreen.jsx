import { useEffect } from "react";
import { useRandomTool } from "./LandingScreen/hooks/useRandomTool";
import { useFilters } from "./LandingScreen/hooks/useFilters";
import { DiceRollingOverlay } from "./LandingScreen/components/DiceRollingOverlay";
import { RevealOverlay } from "./LandingScreen/components/RevealOverlay";
import { LandingHeader } from "./LandingScreen/components/LandingHeader";
import { ActionCards } from "./LandingScreen/components/ActionCards";
import { FilterPanel } from "./LandingScreen/components/FilterPanel";
import { LandingAnimations } from "./LandingScreen/styles/animations";

export function LandingScreen({
  tools,
  onSelectTool,
  onShowGenereer,
  onShowAlleWerkvormen,
  onDismiss,
  allDoelgroepen,
  allAnaloogDigitaal,
  allPlaatsTijd,
  allGoals,
  allCategories,
  images,
}) {
  const {
    rolling,
    revealTool,
    noResult,
    doRoll,
    showRevealCard,
    handleGoToTool,
    handleCloseReveal,
    handleReRoll,
  } = useRandomTool();

  const {
    showFilterPanel,
    setShowFilterPanel,
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

  // Escape key closes reveal card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (revealTool) {
          handleCloseReveal();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealTool]);

  const toolCount = tools ? tools.length : 0;

  const handleRandomWerkvorm = () => {
    if (!tools || tools.length === 0) return;
    doRoll(tools, "all", (pick) =>
      showRevealCard(pick, () => handleGoToTool(pick, onSelectTool)),
    );
  };

  const handleRandomFavoriet = () => {
    if (!tools || tools.length === 0) return;
    const favorieten = tools.filter(
      (t) =>
        t.tags &&
        t.tags.some((tag) => tag.toLowerCase() === "favoriet van robert"),
    );
    doRoll(favorieten, "favoriet", (pick) =>
      showRevealCard(pick, () => handleGoToTool(pick, onSelectTool)),
    );
  };

  const handleFilteredRandom = () => {
    const filtered = getFilteredPool(tools);
    doRoll(filtered, "filtered", (pick) =>
      showRevealCard(pick, () => handleGoToTool(pick, onSelectTool)),
    );
  };

  const getFavorietenPool = () => {
    if (!tools || tools.length === 0) return [];
    return tools.filter(
      (t) =>
        t.tags &&
        t.tags.some((tag) => tag.toLowerCase() === "favoriet van robert"),
    );
  };

  const handleReRollClick = () => {
    const { pool, source } = handleReRoll(
      tools,
      () => getFilteredPool(tools),
      getFavorietenPool,
    );
    doRoll(pool, source, (pick) =>
      showRevealCard(pick, () => handleGoToTool(pick, onSelectTool)),
    );
  };

  const handleToggleFilter = (value) => {
    // Determine which filter array to toggle based on the value
    if (allDoelgroepen && allDoelgroepen.includes(value)) {
      toggleFilter(filterDoelgroep, setFilterDoelgroep, value);
    } else if (allAnaloogDigitaal && allAnaloogDigitaal.includes(value)) {
      toggleFilter(filterAnaloog, setFilterAnaloog, value);
    } else if (allPlaatsTijd && allPlaatsTijd.includes(value)) {
      toggleFilter(filterPlaats, setFilterPlaats, value);
    } else if (allCategories && allCategories.includes(value)) {
      toggleFilter(filterCategorie, setFilterCategorie, value);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "#FAFBFC",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Work Sans, sans-serif",
      }}
    >
      {/* Dice rolling overlay */}
      {rolling && <DiceRollingOverlay />}

      {/* REVEAL overlay — shown after dice roll */}
      {revealTool && (
        <RevealOverlay
          tool={revealTool}
          images={images}
          onGoToTool={() => handleGoToTool(revealTool, onSelectTool)}
          onClose={handleCloseReveal}
          onReRoll={handleReRollClick}
        />
      )}

      {/* Scrollable content */}
      <div
        className="landing-fade"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 32px 40px",
        }}
      >
        <LandingHeader toolCount={toolCount} onDismiss={onDismiss} />

        {/* 4 cards in a row */}
        <ActionCards
          onRandomWerkvorm={handleRandomWerkvorm}
          onRandomFavoriet={handleRandomFavoriet}
          onShowFilters={() => setShowFilterPanel(!showFilterPanel)}
          onShowGenereer={onShowGenereer}
          onShowAlleWerkvormen={onShowAlleWerkvormen}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Floating filter panel overlay */}
      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        allGoals={allGoals}
        allCategories={allCategories}
        allDoelgroepen={allDoelgroepen}
        allAnaloogDigitaal={allAnaloogDigitaal}
        allPlaatsTijd={allPlaatsTijd}
        filterGoal={filterGoal}
        setFilterGoal={setFilterGoal}
        filterCategorie={filterCategorie}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
        filterDoelgroep={filterDoelgroep}
        filterAnaloog={filterAnaloog}
        filterPlaats={filterPlaats}
        toggleFilter={handleToggleFilter}
        onFilteredRandom={handleFilteredRandom}
        hasAnyFilterSelected={hasAnyFilterSelected}
        noResult={noResult}
      />

      <LandingAnimations />
    </div>
  );
}
