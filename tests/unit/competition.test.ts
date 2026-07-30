import { describe, expect, it } from "vitest";
import { calculateCompetitionTotals, createRecognitionEvent, voidLatestPoint } from "~/features/competition/calculations";
import { competitionEvents, players, program } from "~/lib/sample-data";

describe("Gold vs. Black competition", () => {
  it("keeps 8U and 10U score totals separated", () => {
    const totals = calculateCompetitionTotals(competitionEvents);
    expect(totals["age-8u"].gold).toBe(1);
    expect(totals["age-8u"].black).toBe(0);
    expect(totals["age-10u"].gold).toBe(0);
    expect(totals["age-10u"].black).toBe(3);
    expect(totals.program.gold).toBe(1);
    expect(totals.program.black).toBe(3);
  });

  it("creates recognition points from player age group and team", () => {
    const player = players.find((item) => item.id === "p8-1")!;
    const event = createRecognitionEvent({
      player,
      programId: program.id,
      reason: "Effort",
      awardedBy: "coach-head",
    });

    expect(event.ageGroupId).toBe("age-8u");
    expect(event.competitionTeam).toBe("gold");
    expect(event.pointValue).toBe(1);
    expect(event.syncStatus).toBe("pending");
  });

  it("voids the latest active point", () => {
    const updated = voidLatestPoint([
      { ...competitionEvents[0], awardedAt: "2026-07-30T09:00:00.000Z" },
      { ...competitionEvents[1], awardedAt: "2026-07-30T09:05:00.000Z" },
    ]);
    expect(updated.find((event) => event.id === "event-1")?.voided).toBe(false);
    expect(updated.find((event) => event.id === "event-2")?.voided).toBe(true);
  });
});
