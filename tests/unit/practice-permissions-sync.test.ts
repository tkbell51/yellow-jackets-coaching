import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { can } from "~/features/permissions/permissions";
import { calculatePracticeMinutes } from "~/features/practice/calculations";
import { db } from "~/lib/offline/db";
import { getSyncSummary, queueLocalWrite } from "~/lib/offline/sync";
import { coaches, practicePeriods } from "~/lib/sample-data";

describe("practice and permissions", () => {
  it("calculates the default 90 minute practice duration", () => {
    const periods = practicePeriods.filter((period) => period.practiceId === "practice-today");
    expect(calculatePracticeMinutes(periods)).toBe(90);
  });

  it("allows assistants to record attendance without full settings access", () => {
    const assistant = coaches.find((coach) => coach.role === "assistant_coach");
    expect(can(assistant, "attendance:record")).toBe(true);
    expect(can(assistant, "program:settings")).toBe(false);
  });
});

describe("local-first sync queue", () => {
  beforeEach(async () => {
    await db.syncQueue.clear();
  });

  it("queues local writes as pending with no duplicates for a generated item id", async () => {
    await queueLocalWrite({
      entityType: "attendance_records",
      entityId: "attendance-local-1",
      operation: "upsert",
      payload: { id: "attendance-local-1" },
    });

    const summary = await getSyncSummary();
    expect(summary.pending).toBe(1);
    expect(summary.failed).toBe(0);
  });
});
