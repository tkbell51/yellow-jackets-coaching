import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { calculateCompetitionTotals, createRecognitionEvent, formatPointMessage, voidLatestPoint } from "~/features/competition/calculations";
import { queueLocalWrite } from "~/lib/offline/sync";
import { ageGroups, competitionEvents as seedEvents, players, practices, program } from "~/lib/sample-data";
import type { CompetitionEvent, RecognitionReason } from "~/types/domain";

const reasons: RecognitionReason[] = ["Effort", "Attitude", "Toughness"];

export default function CompetitionDashboard() {
  const [events, setEvents] = useState<CompetitionEvent[]>(seedEvents);
  const [ageGroupId, setAgeGroupId] = useState("age-8u");
  const [message, setMessage] = useState("");
  const totals = calculateCompetitionTotals(events);
  const agePlayers = players.filter((player) => player.ageGroupId === ageGroupId && player.active);

  async function award(reason: RecognitionReason, playerId?: string, team?: "gold" | "black") {
    const player = players.find((item) => item.id === playerId);
    const event = createRecognitionEvent({
      player,
      ageGroupId,
      competitionTeam: team,
      programId: program.id,
      practiceId: practices[1].id,
      reason,
      awardedBy: "coach-head",
    });
    setEvents((current) => [event, ...current]);
    setMessage(formatPointMessage(event, ageGroups));
    await queueLocalWrite({ entityType: "competition_events", entityId: event.id, operation: "upsert", payload: event });
  }

  async function undo() {
    const latest = events.filter((event) => !event.voided).sort((a, b) => b.awardedAt.localeCompare(a.awardedAt))[0];
    setEvents(voidLatestPoint(events));
    if (latest) {
      await queueLocalWrite({ entityType: "competition_events", entityId: latest.id, operation: "void", payload: { ...latest, voided: true } });
      setMessage(`Undid ${formatPointMessage(latest, ageGroups)}`);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md bg-black p-4 text-white">
        <h1 className="text-2xl font-black">Gold vs. Black</h1>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Score label="Program Gold" value={totals.program?.gold ?? 0} gold />
          <Score label="Program Black" value={totals.program?.black ?? 0} />
          {ageGroups.map((group) => (
            <div key={group.id} className="rounded-md border border-zinc-700 p-3">
              <p className="font-black">{group.name}</p>
              <p className="text-sm text-zinc-300">Gold {totals[group.id]?.gold ?? 0} • Black {totals[group.id]?.black ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {ageGroups.map((group) => (
              <button key={group.id} onClick={() => setAgeGroupId(group.id)} className={`min-h-11 rounded-md border px-4 font-black ${ageGroupId === group.id ? "bg-[#D0B988] text-black" : "bg-white"}`}>
                {group.name}
              </button>
            ))}
          </div>
          <button onClick={undo} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-zinc-300 px-4 font-black">
            <RotateCcw aria-hidden size={18} /> Undo
          </button>
        </div>
        {message && <p className="mt-3 rounded-md bg-[#D0B988] p-3 font-black text-black">{message}</p>}
        <h2 className="mt-5 text-lg font-black">Team-wide Recognition</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["gold", "black"] as const).flatMap((team) =>
            reasons.map((reason) => (
              <button key={`${team}-${reason}`} onClick={() => award(reason, undefined, team)} className={`min-h-14 rounded-md px-3 font-black ${team === "gold" ? "bg-[#D0B988] text-black" : "bg-black text-white"}`}>
                {team} +1 {reason}
              </button>
            )),
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-black">Tap Player, Then E.A.T.</h2>
        {agePlayers.map((player) => (
          <article key={player.id} className="rounded-md border border-zinc-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="font-black">#{player.jerseyNumber} {player.firstName} {player.lastName}</p>
              <Badge tone={player.competitionTeam === "gold" ? "gold" : "dark"}>{player.competitionTeam}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {reasons.map((reason) => (
                <button key={reason} onClick={() => award(reason, player.id)} className="min-h-12 rounded-md border border-zinc-300 bg-zinc-50 font-black">
                  {reason}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Score({ label, value, gold = false }: { label: string; value: number; gold?: boolean }) {
  return (
    <div className={`rounded-md p-3 ${gold ? "bg-[#D0B988] text-black" : "bg-white text-black"}`}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
