import type { Route } from "./+types/player-detail";
import { Badge } from "~/components/ui/badge";
import { ageGroups, players } from "~/lib/sample-data";

export default function PlayerDetail({ params }: Route.ComponentProps) {
  const player = players.find((item) => item.id === params.playerId) ?? players[0];
  const ageGroup = ageGroups.find((group) => group.id === player.ageGroupId);

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-5xl font-black">#{player.jerseyNumber}</p>
          <h1 className="mt-2 text-2xl font-black">{player.firstName} {player.lastName}</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Badge>{ageGroup?.name}</Badge>
          <Badge tone={player.competitionTeam === "gold" ? "gold" : "dark"}>{player.competitionTeam}</Badge>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info label="Availability" value={player.availabilityStatus} />
        <Info label="Primary offense" value={player.primaryOffensePosition} />
        <Info label="Backup offense" value={player.backupOffensePositions.join(", ") || "None"} />
        <Info label="Primary defense" value={player.primaryDefensePosition} />
        <Info label="Backup defense" value={player.backupDefensePositions.join(", ") || "None"} />
        <Info label="Development focus" value={player.developmentFocus || "None"} />
      </dl>
      <button className="mt-5 min-h-12 rounded-md border border-zinc-300 px-4 font-black">Archive / Deactivate</button>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <dt className="text-xs font-black uppercase text-zinc-600">{label}</dt>
      <dd className="mt-1 font-bold capitalize">{value}</dd>
    </div>
  );
}
