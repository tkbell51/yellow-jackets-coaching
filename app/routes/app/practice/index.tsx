import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { calculateAttendanceSummary } from "~/features/attendance/calculations";
import { queueLocalWrite } from "~/lib/offline/sync";
import { ageGroups, attendanceRecords as seedAttendance, players, practices } from "~/lib/sample-data";
import type { AttendanceRecord, AttendanceStatus } from "~/types/domain";

const statuses: AttendanceStatus[] = ["present", "absent", "injured", "ineligible", "unavailable"];

export default function PracticeToday() {
  const practice = practices.find((item) => item.id === "practice-today")!;
  const [ageGroupId, setAgeGroupId] = useState("age-8u");
  const [records, setRecords] = useState<AttendanceRecord[]>(seedAttendance);
  const filteredPlayers = players.filter((player) => player.ageGroupId === ageGroupId && player.active);
  const summary = calculateAttendanceSummary(filteredPlayers, records);

  async function record(playerId: string, status: AttendanceStatus) {
    const next: AttendanceRecord = {
      id: crypto.randomUUID(),
      playerId,
      practiceId: practice.id,
      status,
      recordedBy: "coach-head",
      recordedAt: new Date().toISOString(),
      syncStatus: "pending",
    };
    setRecords((current) => [next, ...current]);
    await queueLocalWrite({ entityType: "attendance_records", entityId: next.id, operation: "upsert", payload: next });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">{practice.name}</h1>
            <p className="text-sm text-zinc-700">{practice.startTime}-{practice.endTime} • {practice.field}</p>
          </div>
          <Link to={`/app/practice/${practice.id}/run`} className="inline-flex min-h-12 items-center rounded-md bg-black px-4 font-black text-white">
            Start Practice
          </Link>
        </div>
        <div className="mt-4 flex gap-2">
          {ageGroups.map((group) => (
            <button key={group.id} onClick={() => setAgeGroupId(group.id)} className={`min-h-11 rounded-md border px-4 font-black ${ageGroupId === group.id ? "bg-[#D0B988] text-black" : "bg-white text-zinc-950"}`}>
              {group.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Badge tone="success">Present {summary.present}</Badge>
          <Badge tone="warning">Absent {summary.absent}</Badge>
          <Badge>Open {summary.unrecorded}</Badge>
        </div>
      </section>

      <section className="space-y-2">
        {filteredPlayers.map((player) => {
          const latest = records.find((item) => item.playerId === player.id);
          return (
            <article key={player.id} className="rounded-md border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-black">#{player.jerseyNumber} {player.firstName} {player.lastName}</p>
                  <p className="text-sm text-zinc-700">{latest?.status ?? "unrecorded"}</p>
                </div>
                <Badge tone={player.competitionTeam === "gold" ? "gold" : "dark"}>{player.competitionTeam}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {statuses.map((status) => (
                  <button key={status} onClick={() => record(player.id, status)} className="min-h-12 rounded-md border border-zinc-300 bg-zinc-50 px-2 text-sm font-black capitalize focus:outline-none focus:ring-2 focus:ring-[#D0B988]">
                    {status}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
