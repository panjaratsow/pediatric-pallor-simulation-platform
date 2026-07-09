import { bleedingInvestigationOptions } from "./caseBankBleeding";
import type { BleedingCase, InvestigationId } from "./bleedingTypes";

function passesItem(
  selected: Set<InvestigationId>,
  item: BleedingCase["investigationScores"][number],
): boolean {
  if (item.requiredAll && !item.requiredAll.every((id) => selected.has(id))) return false;
  if (item.requiredAny && !item.requiredAny.some((id) => selected.has(id))) return false;
  if (item.avoided && !item.avoided.every((id) => !selected.has(id))) return false;
  return true;
}

export function scoreInvestigations(currentCase: BleedingCase, selected: Set<InvestigationId>) {
  const hits = currentCase.investigationScores.filter((item) => passesItem(selected, item));
  const misses = currentCase.investigationScores.filter((item) => !passesItem(selected, item));
  const score = Math.min(20, hits.reduce((total, item) => total + item.points, 0));
  const selectedOptions = bleedingInvestigationOptions.filter((option) => selected.has(option.id));

  const strengths = hits.map((item) => `${item.label} (+${item.points})`);
  const advice = [
    ...misses.map((item) => `ควรพิจารณา: ${item.label}`),
    ...selectedOptions
      .filter((option) => currentCase.investigationNotes[option.id])
      .map((option) => `${option.label}: ${currentCase.investigationNotes[option.id]}`),
  ];

  return { score, strengths, advice };
}
