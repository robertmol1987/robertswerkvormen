export function getFilterSummary(
  searchQuery,
  goalFilter,
  tagFilter,
  doelgroepFilter,
  analoogDigitaalFilter,
  plaatsTijdFilter,
) {
  const filterSummaryParts = [];
  if (searchQuery) filterSummaryParts.push(`Gevonden voor "${searchQuery}"`);
  if (goalFilter) filterSummaryParts.push(`Met doel "${goalFilter}"`);
  if (tagFilter && tagFilter.length > 0) {
    const tagStr = tagFilter.map((t) => `"${t}"`).join(" én ");
    filterSummaryParts.push(`Met tag ${tagStr}`);
  }
  if (doelgroepFilter && doelgroepFilter.length > 0) {
    filterSummaryParts.push(`Doelgroep: ${doelgroepFilter.join(", ")}`);
  }
  if (analoogDigitaalFilter && analoogDigitaalFilter.length > 0) {
    filterSummaryParts.push(`Type: ${analoogDigitaalFilter.join(", ")}`);
  }
  if (plaatsTijdFilter && plaatsTijdFilter.length > 0) {
    filterSummaryParts.push(`Locatie: ${plaatsTijdFilter.join(", ")}`);
  }
  return filterSummaryParts.join(" · ");
}

export function hasActiveFilters(
  searchQuery,
  goalFilter,
  tagFilter,
  doelgroepFilter,
  analoogDigitaalFilter,
  plaatsTijdFilter,
) {
  return (
    searchQuery ||
    goalFilter ||
    (tagFilter && tagFilter.length > 0) ||
    (doelgroepFilter && doelgroepFilter.length > 0) ||
    (analoogDigitaalFilter && analoogDigitaalFilter.length > 0) ||
    (plaatsTijdFilter && plaatsTijdFilter.length > 0)
  );
}
