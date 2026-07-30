import type { AttendanceRecord, AttendanceStatus, Player } from "~/types/domain";

export function calculateAttendanceSummary(players: Player[], records: AttendanceRecord[]) {
  const latestByPlayer = new Map<string, AttendanceRecord>();
  for (const record of records) {
    const current = latestByPlayer.get(record.playerId);
    if (!current || record.recordedAt > current.recordedAt) {
      latestByPlayer.set(record.playerId, record);
    }
  }

  const summary: Record<AttendanceStatus | "unrecorded", number> = {
    present: 0,
    absent: 0,
    injured: 0,
    ineligible: 0,
    unavailable: 0,
    unrecorded: 0,
  };

  for (const player of players.filter((item) => item.active)) {
    const record = latestByPlayer.get(player.id);
    summary[record?.status ?? "unrecorded"] += 1;
  }

  return summary;
}
