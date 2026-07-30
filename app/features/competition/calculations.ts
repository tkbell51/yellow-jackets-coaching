import type { AgeGroup, CompetitionEvent, CompetitionTeam, Player, RecognitionReason } from "~/types/domain";

export function calculateCompetitionTotals(events: CompetitionEvent[]) {
  return events
    .filter((event) => !event.voided)
    .reduce<Record<string, Record<CompetitionTeam, number>>>((totals, event) => {
      totals.program ??= { gold: 0, black: 0 };
      totals[event.ageGroupId] ??= { gold: 0, black: 0 };
      totals.program[event.competitionTeam] += event.pointValue;
      totals[event.ageGroupId][event.competitionTeam] += event.pointValue;
      return totals;
    }, {});
}

export function createRecognitionEvent(input: {
  player?: Player;
  ageGroupId?: string;
  competitionTeam?: CompetitionTeam;
  programId: string;
  practiceId?: string;
  reason: RecognitionReason;
  awardedBy: string;
}): CompetitionEvent {
  const ageGroupId = input.player?.ageGroupId ?? input.ageGroupId;
  const competitionTeam = input.player?.competitionTeam ?? input.competitionTeam;

  if (!ageGroupId || !competitionTeam) {
    throw new Error("Recognition points require an age group and competition team.");
  }

  return {
    id: crypto.randomUUID(),
    programId: input.programId,
    practiceId: input.practiceId,
    ageGroupId,
    competitionTeam,
    pointType: "recognition",
    reason: input.reason,
    pointValue: 1,
    playerId: input.player?.id,
    awardedBy: input.awardedBy,
    awardedAt: new Date().toISOString(),
    voided: false,
    syncStatus: "pending",
  };
}

export function voidLatestPoint(events: CompetitionEvent[]) {
  const latest = [...events]
    .filter((event) => !event.voided)
    .sort((a, b) => b.awardedAt.localeCompare(a.awardedAt))[0];

  return events.map((event) =>
    latest && event.id === latest.id ? { ...event, voided: true as const, syncStatus: "pending" as const } : event,
  );
}

export function formatPointMessage(event: CompetitionEvent, ageGroups: AgeGroup[]) {
  const ageGroup = ageGroups.find((group) => group.id === event.ageGroupId)?.name ?? "Team";
  const team = event.competitionTeam === "gold" ? "Gold" : "Black";
  const value = event.pointValue > 0 ? `+${event.pointValue}` : String(event.pointValue);
  return `${ageGroup} ${team} ${value} for ${event.reason}`;
}
