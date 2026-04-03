import { Target } from "lucide-react";
import { GoalCard } from "../components/GoalCard";

export function GoalsView({ tools, allGoals, onGoalCardClick }) {
  const goalCounts = {};
  if (tools && tools.length > 0) {
    for (const tool of tools) {
      if (tool.goals) {
        for (const goal of tool.goals) {
          goalCounts[goal] = (goalCounts[goal] || 0) + 1;
        }
      }
    }
  }

  const goalsToShow =
    allGoals && allGoals.length > 0
      ? allGoals
      : Object.keys(goalCounts).sort((a, b) => a.localeCompare(b, "nl"));

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="p-8 pt-6 page-fade">
        <h2
          className="font-bold mb-1"
          style={{ fontSize: "24px", color: "#1A1A1A" }}
        >
          Alle doelen{" "}
          <span style={{ fontSize: "15px", fontWeight: 400, color: "#888" }}>
            ({goalsToShow.length} doelen)
          </span>
        </h2>
        <p className="mb-6" style={{ fontSize: "15px", color: "#666" }}>
          Klik op een doel om alle werkvormen met dat doel te bekijken.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))",
            gap: "12px",
            maxWidth: "1456px",
          }}
        >
          {goalsToShow.map((goal) => {
            const toolCount = goalCounts[goal] || 0;
            return (
              <GoalCard
                key={goal}
                goal={goal}
                toolCount={toolCount}
                onClick={() => onGoalCardClick(goal)}
              />
            );
          })}
        </div>

        {goalsToShow.length === 0 && (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <Target size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p className="text-sm">Geen doelen gevonden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
