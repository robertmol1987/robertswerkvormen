import { useState, useRef } from "react";
import { playDiceRoll, playReveal } from "@/utils/sounds";

export function useRandomTool(tools) {
  const [rolling, setRolling] = useState(false);
  const [revealTool, setRevealTool] = useState(null);
  const [lastRollSource, setLastRollSource] = useState("all");
  const [noResult, setNoResult] = useState(false);
  const rollTimeoutRef = useRef(null);
  const autoGoTimeoutRef = useRef(null);

  const pickRandom = (pool) => {
    if (!pool || pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const showRevealCard = (pick, onSelectTool) => {
    playReveal();
    setRevealTool(pick);
    autoGoTimeoutRef.current = setTimeout(() => {
      handleGoToTool(pick, onSelectTool);
    }, 6000);
  };

  const handleGoToTool = (tool, onSelectTool) => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    setRevealTool(null);
    onSelectTool(tool);
  };

  const handleCloseReveal = () => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    setRevealTool(null);
  };

  const doRoll = (pool, source, onSelectTool) => {
    if (!pool || pool.length === 0) {
      setNoResult(true);
      return;
    }
    setNoResult(false);
    setLastRollSource(source);
    setRolling(true);
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    playDiceRoll(3600);
    clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(() => {
      setRolling(false);
      const pick = pickRandom(pool);
      if (pick) showRevealCard(pick, onSelectTool);
    }, 3600);
  };

  const handleRandomWerkvorm = (onSelectTool) => {
    if (!tools || tools.length === 0) return;
    doRoll(tools, "all", onSelectTool);
  };

  const handleRandomFavoriet = (onSelectTool) => {
    if (!tools || tools.length === 0) return;
    const favorieten = tools.filter(
      (t) =>
        t.tags &&
        t.tags.some((tag) => tag.toLowerCase() === "favoriet van robert"),
    );
    doRoll(favorieten, "favoriet", onSelectTool);
  };

  const handleFilteredRandom = (filteredPool, onSelectTool) => {
    doRoll(filteredPool, "filtered", onSelectTool);
  };

  const handleReRoll = (getFilteredPool, onSelectTool) => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    let pool;
    if (lastRollSource === "filtered") {
      pool = getFilteredPool();
    } else if (lastRollSource === "favoriet") {
      pool = tools.filter(
        (t) =>
          t.tags &&
          t.tags.some((tag) => tag.toLowerCase() === "favoriet van robert"),
      );
    } else {
      pool = tools;
    }
    setRevealTool(null);
    doRoll(pool, lastRollSource, onSelectTool);
  };

  return {
    rolling,
    revealTool,
    noResult,
    handleRandomWerkvorm,
    handleRandomFavoriet,
    handleFilteredRandom,
    handleReRoll,
    handleGoToTool,
    handleCloseReveal,
  };
}
