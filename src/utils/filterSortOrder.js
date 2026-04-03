/**
 * Canonical sort orders for filter values.
 * These ensure consistent ordering across all filter UIs.
 */

const DOELGROEP_ORDER = [
  "Primair onderwijs (PO)",
  "Speciaal onderwijs (SO)",
  "Voortgezet onderwijs (VO)",
  "Middelbaar beroepsonderwijs (MBO)",
  "Associate Degree onderwijs (AD)",
  "Hoger beroepsonderwijs (HBO)",
  "Wetenschappelijk onderwijs (WO)",
];

const TYPE_ORDER = ["Analoog", "Digitaal", "AI"];

const LOCATIE_ORDER = [
  "Fysiek in de klas",
  "Live op afstand",
  "Buiten het lesmoment om",
];

function sortByOrder(items, order) {
  if (!items || items.length === 0) return [];
  const arr = Array.isArray(items) ? items : Array.from(items);
  return [...arr].sort((a, b) => {
    const ia = order.findIndex((o) =>
      a.toLowerCase().includes(o.toLowerCase()),
    );
    const ib = order.findIndex((o) =>
      b.toLowerCase().includes(o.toLowerCase()),
    );
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

export function sortDoelgroepen(items) {
  return sortByOrder(items, DOELGROEP_ORDER);
}

export function sortAnaloogDigitaal(items) {
  return sortByOrder(items, TYPE_ORDER);
}

export function sortPlaatsTijd(items) {
  return sortByOrder(items, LOCATIE_ORDER);
}
