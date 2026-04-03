import { useState, useRef } from "react";
import { playDiceRoll, playReveal } from "@/utils/sounds";

export function useRandomTool() {
  const [rolling, setRolling] = useState(false);
  const [revealTool, setRevealTool] = useState(null);
  const [rollSource, setRollSource] = useState("all"); // "all", "favoriet", or "filtered"
  const [noResult, setNoResult] = useState(false);
  const rollTimeoutRef = useRef(null);
  const autoGoTimeoutRef = useRef(null);

  const pickRandom = (pool) => {
    if (!pool || pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const showRevealCard = (pick, onAutoNavigate) => {
    playReveal();
    setRevealTool(pick);
    autoGoTimeoutRef.current = setTimeout(() => {
      onAutoNavigate(pick);
    }, 6000);
  };

  const doRoll = (pool, source, onReveal) => {
    if (!pool || pool.length === 0) {
      setNoResult(true);
      return;
    }
    setNoResult(false);
    setRollSource(source);
    setRolling(true);
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    playDiceRoll(3600);
    clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(() => {
      setRolling(false);
      const pick = pickRandom(pool);
      if (pick) onReveal(pick);
    }, 3600);
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

  const handleReRoll = (tools, getFilteredPool, getFavorietenPool) => {
    if (autoGoTimeoutRef.current) clearTimeout(autoGoTimeoutRef.current);
    let pool;
    if (rollSource === "filtered") {
      pool = getFilteredPool();
    } else if (rollSource === "favoriet") {
      pool = getFavorietenPool();
    } else {
      pool = tools;
    }
    setRevealTool(null);
    return { pool, source: rollSource };
  };

  return {
    rolling,
    revealTool,
    rollSource,
    noResult,
    doRoll,
    showRevealCard,
    handleGoToTool,
    handleCloseReveal,
    handleReRoll,
  };
}
