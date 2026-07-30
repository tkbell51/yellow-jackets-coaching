import { Search, UserRoundPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { playerSchema } from "~/lib/validation/schemas";
import { ageGroups, players as seedPlayers } from "~/lib/sample-data";
import type { Player } from "~/types/domain";

export default function PlayersRoute() {
  const [players, setPlayers] = useState<Player[]>(seedPlayers);
  const [ageGroupId, setAgeGroupId] = useState("all");
  const [team, setTeam] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(
    () =>
      players.filter((player) => {
        const text = `${player.firstName} ${player.lastName} ${player.jerseyNumber}`.toLowerCase();
        return (
          player.active &&
          (ageGroupId === "all" || player.ageGroupId === ageGroupId) &&
          (team === "all" || player.competitionTeam === team) &&
          text.includes(query.toLowerCase())
        );
      }),
    [players, ageGroupId, team, query],
  );

  function addPlayer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = playerSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the player details.");
      return;
    }
    const duplicate = players.some(
      (player) => player.ageGroupId === parsed.data.ageGroupId && player.jerseyNumber === parsed.data.jerseyNumber && player.active,
    );
    if (duplicate) {
      setError("That jersey number is already used in this age group.");
      return;
    }
    const now = new Date().toISOString();
    setPlayers((current) => [
      {
        id: crypto.randomUUID(),
        ...parsed.data,
        active: true,
        backupOffensePositions: [],
        backupDefensePositions: [],
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ]);
    setShowForm(false);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Roster</h1>
            <p className="text-sm text-zinc-700">8U and 10U players with Gold or Black assignment.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-black px-4 font-black text-white">
            <UserRoundPlus aria-hidden size={19} /> Add Player
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search players</span>
            <Search className="absolute left-3 top-3.5 text-zinc-500" aria-hidden size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-md border border-zinc-300 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#D0B988]" placeholder="Search name or number" />
          </label>
          <select value={ageGroupId} onChange={(event) => setAgeGroupId(event.target.value)} className="min-h-12 rounded-md border border-zinc-300 px-3 font-bold">
            <option value="all">All ages</option>
            {ageGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
          <select value={team} onChange={(event) => setTeam(event.target.value)} className="min-h-12 rounded-md border border-zinc-300 px-3 font-bold">
            <option value="all">Gold + Black</option>
            <option value="gold">Gold</option>
            <option value="black">Black</option>
          </select>
        </div>
      </section>

      {showForm && (
        <form onSubmit={addPlayer} className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-black">Add Player</h2>
          {error && <p className="mt-2 rounded-md bg-red-100 p-3 text-sm font-bold text-red-950">{error}</p>}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input name="firstName" label="First name" />
            <Input name="lastName" label="Last name" />
            <Input name="preferredName" label="Nickname" />
            <Input name="jerseyNumber" label="Jersey number" type="number" />
            <Select name="ageGroupId" label="Age group" options={ageGroups.map((group) => [group.id, group.name])} />
            <Select name="competitionTeam" label="Gold or Black" options={[["gold", "Gold"], ["black", "Black"]]} />
            <Select name="availabilityStatus" label="Availability" options={[["active", "Active"], ["absent", "Absent"], ["injured", "Injured"], ["ineligible", "Ineligible"], ["unavailable", "Unavailable"]]} />
            <Input name="primaryOffensePosition" label="Primary offense" />
            <Input name="primaryDefensePosition" label="Primary defense" />
            <Input name="developmentFocus" label="Development focus" />
          </div>
          <button className="mt-4 min-h-12 rounded-md bg-[#D0B988] px-4 font-black text-black">Save Player</button>
        </form>
      )}

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((player) => (
          <Link key={player.id} to={`/app/team/players/${player.id}`} className="rounded-md border border-zinc-200 bg-white p-4 focus:outline-none focus:ring-2 focus:ring-[#D0B988]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-black">#{player.jerseyNumber}</p>
                <h2 className="text-lg font-black">{player.preferredName || player.firstName} {player.lastName}</h2>
              </div>
              <Badge tone={player.competitionTeam === "gold" ? "gold" : "dark"}>{player.competitionTeam}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{ageGroups.find((group) => group.id === player.ageGroupId)?.name}</Badge>
              <Badge tone={player.availabilityStatus === "active" ? "success" : "warning"}>{player.availabilityStatus}</Badge>
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-700">Offense {player.primaryOffensePosition} • Defense {player.primaryDefensePosition}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Input({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input name={name} type={type} className="mt-1 min-h-11 w-full rounded-md border border-zinc-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#D0B988]" />
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[][] }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <select name={name} className="mt-1 min-h-11 w-full rounded-md border border-zinc-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#D0B988]">
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );
}
