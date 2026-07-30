import { describe, expect, it } from "vitest";
import { calculateAttendanceSummary } from "~/features/attendance/calculations";
import { attendanceRecords, players } from "~/lib/sample-data";

describe("attendance calculations", () => {
  it("counts present, absent, and unrecorded players", () => {
    const eightU = players.filter((player) => player.ageGroupId === "age-8u");
    const summary = calculateAttendanceSummary(eightU, attendanceRecords);

    expect(summary.present).toBe(7);
    expect(summary.absent).toBe(1);
    expect(summary.unrecorded).toBe(0);
  });
});
