import { db } from "~/lib/offline/db";
import { getSupabaseClient } from "~/lib/supabase/client";
import type { SyncQueueItem } from "~/types/domain";

export async function queueLocalWrite(
  item: Omit<SyncQueueItem, "id" | "createdAt" | "attemptCount" | "status">,
) {
  const queued: SyncQueueItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    attemptCount: 0,
    status: "pending",
  };

  await db.syncQueue.add(queued);
  return queued;
}

export async function getSyncSummary() {
  const [pending, syncing, failed] = await Promise.all([
    db.syncQueue.where("status").equals("pending").count(),
    db.syncQueue.where("status").equals("syncing").count(),
    db.syncQueue.where("status").equals("failed").count(),
  ]);

  return { pending, syncing, failed };
}

export async function processSyncQueue() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return getSyncSummary();
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return getSyncSummary();
  }

  const items = await db.syncQueue.where("status").anyOf(["pending", "failed"]).sortBy("createdAt");

  for (const item of items) {
    await db.syncQueue.update(item.id, {
      status: "syncing",
      attemptCount: item.attemptCount + 1,
      lastAttemptAt: new Date().toISOString(),
    });

    const { error } = await supabase.from(item.entityType).upsert(item.payload as never, { onConflict: "id" });

    if (error) {
      await db.syncQueue.update(item.id, {
        status: "failed",
        lastError: error.message,
      });
    } else {
      await db.syncQueue.update(item.id, {
        status: "synced",
        lastError: undefined,
      });
    }
  }

  return getSyncSummary();
}
