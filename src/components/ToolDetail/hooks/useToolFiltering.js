import { useMemo } from "react";

export function useToolFiltering(
  tools,
  searchQuery,
  goalFilter,
  tagFilter,
  doelgroepFilter,
  analoogDigitaalFilter,
  plaatsTijdFilter,
  favorietFilter,
) {
  return useMemo(() => {
    return tools.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.subtitle && t.subtitle.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q));
      const matchesGoal =
        !goalFilter ||
        t.goals.some((g) => g.toLowerCase().includes(goalFilter.toLowerCase()));
      const matchesTags =
        !tagFilter ||
        tagFilter.length === 0 ||
        tagFilter.some((filterTag) =>
          t.tags.some(
            (toolTag) => toolTag.toLowerCase() === filterTag.toLowerCase(),
          ),
        );
      const matchesDoelgroep =
        !doelgroepFilter ||
        doelgroepFilter.length === 0 ||
        doelgroepFilter.some(
          (filterDg) =>
            t.doelgroepen &&
            t.doelgroepen.some(
              (dg) => dg.toLowerCase() === filterDg.toLowerCase(),
            ),
        );
      const matchesAnaloogDigitaal =
        !analoogDigitaalFilter ||
        analoogDigitaalFilter.length === 0 ||
        analoogDigitaalFilter.some(
          (filterAd) =>
            t.analoogDigitaal &&
            t.analoogDigitaal.some(
              (ad) => ad.toLowerCase() === filterAd.toLowerCase(),
            ),
        );
      const matchesPlaatsTijd =
        !plaatsTijdFilter ||
        plaatsTijdFilter.length === 0 ||
        plaatsTijdFilter.some(
          (filterPt) =>
            t.plaatsTijd &&
            t.plaatsTijd.some(
              (pt) => pt.toLowerCase() === filterPt.toLowerCase(),
            ),
        );
      const matchesFavoriet =
        !favorietFilter ||
        (t.tags &&
          t.tags.some((tag) => tag.toLowerCase() === "favoriet van robert"));
      return (
        matchesSearch &&
        matchesGoal &&
        matchesTags &&
        matchesDoelgroep &&
        matchesAnaloogDigitaal &&
        matchesPlaatsTijd &&
        matchesFavoriet
      );
    });
  }, [
    tools,
    searchQuery,
    goalFilter,
    tagFilter,
    doelgroepFilter,
    analoogDigitaalFilter,
    plaatsTijdFilter,
    favorietFilter,
  ]);
}
