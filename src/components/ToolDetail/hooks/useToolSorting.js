import { useMemo } from "react";

export function useToolSorting(tools, sortBy) {
  return useMemo(() => {
    return [...tools].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating || a.name.localeCompare(b.name, "nl");
      }
      return a.name.localeCompare(b.name, "nl");
    });
  }, [tools, sortBy]);
}
