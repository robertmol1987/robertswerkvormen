import { useState } from "react";

export function useFilters() {
  const [filterDoelgroep, setFilterDoelgroep] = useState([]);
  const [filterAnaloog, setFilterAnaloog] = useState([]);
  const [filterPlaats, setFilterPlaats] = useState([]);
  const [filterGoal, setFilterGoal] = useState("");
  const [filterCategorie, setFilterCategorie] = useState([]);
  const [filterRating, setFilterRating] = useState(0);

  const toggleFilter = (arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const getFilteredPool = (tools) => {
    if (!tools || tools.length === 0) return [];
    return tools.filter((t) => {
      const matchDg =
        filterDoelgroep.length === 0 ||
        filterDoelgroep.some(
          (dg) =>
            t.doelgroepen &&
            t.doelgroepen.some((d) => d.toLowerCase() === dg.toLowerCase()),
        );
      const matchAd =
        filterAnaloog.length === 0 ||
        filterAnaloog.some(
          (ad) =>
            t.analoogDigitaal &&
            t.analoogDigitaal.some((a) => a.toLowerCase() === ad.toLowerCase()),
        );
      const matchPt =
        filterPlaats.length === 0 ||
        filterPlaats.some(
          (pt) =>
            t.plaatsTijd &&
            t.plaatsTijd.some((p) => p.toLowerCase() === pt.toLowerCase()),
        );
      const matchGoal =
        !filterGoal ||
        (t.goals &&
          t.goals.some((g) =>
            g.toLowerCase().includes(filterGoal.toLowerCase()),
          ));
      const matchCat =
        filterCategorie.length === 0 ||
        filterCategorie.some(
          (c) =>
            t.categories &&
            t.categories.some((tc) => tc.toLowerCase() === c.toLowerCase()),
        );
      const matchRating = filterRating === 0 || t.rating >= filterRating;
      return (
        matchDg && matchAd && matchPt && matchGoal && matchCat && matchRating
      );
    });
  };

  const hasAnyFilterSelected =
    filterDoelgroep.length > 0 ||
    filterAnaloog.length > 0 ||
    filterPlaats.length > 0 ||
    filterCategorie.length > 0 ||
    filterRating > 0 ||
    filterGoal;

  const activeFilterCount =
    filterDoelgroep.length +
    filterAnaloog.length +
    filterPlaats.length +
    filterCategorie.length +
    (filterRating > 0 ? 1 : 0) +
    (filterGoal ? 1 : 0);

  return {
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
  };
}
