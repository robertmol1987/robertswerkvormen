import { GoalsView } from "./ToolDetail/views/GoalsView";
import { DetailView } from "./ToolDetail/views/DetailView";
import { CardGridView } from "./ToolDetail/views/CardGridView";

/**
 * Renders the grid of werkvorm cards or the detail view of a single werkvorm.
 */
export function ToolDetail({
  tools,
  selectedTool,
  onSelectTool,
  categoryTitle,
  categoryDescription,
  categories,
  categoryDescriptions,
  images,
  allGoals,
  goalFilter,
  onGoalFilterChange,
  tagFilter,
  doelgroepFilter,
  analoogDigitaalFilter,
  plaatsTijdFilter,
  favorietFilter,
  showGoalsView,
  onGoalCardClick,
}) {
  // ===== GOALS VIEW =====
  if (showGoalsView && onGoalCardClick) {
    return (
      <GoalsView
        tools={tools}
        allGoals={allGoals}
        onGoalCardClick={onGoalCardClick}
      />
    );
  }

  // ===== DETAIL VIEW =====
  if (selectedTool) {
    return (
      <DetailView
        selectedTool={selectedTool}
        images={images}
        onSelectTool={onSelectTool}
      />
    );
  }

  // ===== CARD GRID VIEW =====
  return (
    <CardGridView
      tools={tools}
      categoryTitle={categoryTitle}
      categoryDescription={categoryDescription}
      categories={categories}
      categoryDescriptions={categoryDescriptions}
      images={images}
      goalFilter={goalFilter}
      tagFilter={tagFilter}
      doelgroepFilter={doelgroepFilter}
      analoogDigitaalFilter={analoogDigitaalFilter}
      plaatsTijdFilter={plaatsTijdFilter}
      favorietFilter={favorietFilter}
      onSelectTool={onSelectTool}
    />
  );
}
