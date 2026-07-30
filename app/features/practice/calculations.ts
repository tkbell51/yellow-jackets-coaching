import type { PracticePeriod } from "~/types/domain";

export function calculatePracticeMinutes(periods: PracticePeriod[]) {
  return periods.reduce((total, period) => total + period.durationMinutes, 0);
}

export function reorderPeriod(periods: PracticePeriod[], periodId: string, direction: "up" | "down") {
  const ordered = [...periods].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((period) => period.id === periodId);
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) {
    return ordered;
  }

  const [period] = ordered.splice(index, 1);
  ordered.splice(nextIndex, 0, period);

  let offset = 0;
  return ordered.map((item, nextOrder) => {
    const updated = { ...item, order: nextOrder + 1, startOffsetMinutes: offset };
    offset += item.durationMinutes;
    return updated;
  });
}
