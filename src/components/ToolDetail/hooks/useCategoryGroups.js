import { useMemo } from "react";

export function useCategoryGroups(
  shouldGroupByCategory,
  categories,
  categoryDescriptions,
  sortedTools,
) {
  return useMemo(() => {
    if (!shouldGroupByCategory || !categories) return null;
    return categories
      .map((cat) => {
        const catTools = sortedTools.filter(
          (t) =>
            t.categories &&
            t.categories.some((c) => c.toLowerCase() === cat.toLowerCase()),
        );
        return {
          category: cat,
          description: categoryDescriptions
            ? categoryDescriptions[cat] || ""
            : "",
          tools: catTools,
        };
      })
      .filter((g) => g.tools.length > 0);
  }, [shouldGroupByCategory, categories, categoryDescriptions, sortedTools]);
}
