import { Award, CalendarClock, ClipboardCheck, UserRoundPlus } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { calculateAttendanceSummary } from "~/features/attendance/calculations";
import { calculateCompetitionTotals } from "~/features/competition/calculations";
import { ageGroups, attendanceRecords, competitionEvents, players, practices, program } from "~/lib/sample-data";

export function meta() {
  return [{ title: "Home | Yellow Jackets Coaching" }];
}

export default function Dashboard() {
  const today = practices.find((practice) => practice.status === "scheduled") ?? practices[0];
  const summary = calculateAttendanceSummary(players, attendanceRecords);
  const totals = calculateCompetitionTotals(competitionEvents);
  const needingAttention = players.filter((player) => player.availabilityStatus !== "active" || player.developmentFocus).slice(0, 4);

  return (
    <div className="space-y-4">
      <section className="bg-black p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-[#D0B988]">{program.shortName}</p>
            <h1 className="mt-1 text-3xl font-black tracking-normal">{program.name}</h1>
          </div>
          <div className="flex gap-2">
            {ageGroups.map((group) => (
              <Badge key={group.id} tone="gold">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Link className="min-h-16 rounded-md bg-[#D0B988] p-3 font-black text-black focus:outline-none focus:ring-2 focus:ring-white" to="/app/practice/practice-today/run">
            Start Practice
          </Link>
          <Link className="min-h-16 rounded-md border border-zinc-700 p-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]" to="/app/practice/competition">
            Award Points
          </Link>
          <Link className="min-h-16 rounded-md border border-zinc-700 p-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]" to="/app/practice">
            Attendance
          </Link>
          <Link className="min-h-16 rounded-md border border-zinc-700 p-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]" to="/app/team/players">
            Roster
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <CalendarClock aria-hidden className="text-zinc-950" />
            <div>
              <h2 className="text-lg font-black">Today</h2>
              <p className="text-sm text-zinc-700">
                {today.name} • {today.startTime}-{today.endTime} • {today.field}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Present" value={summary.present} icon={<ClipboardCheck size={18} />} />
            <Stat label="Absent" value={summary.absent} />
            <Stat label="Unrecorded" value={summary.unrecorded} />
          </div>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <Award aria-hidden className="text-zinc-950" />
            <h2 className="text-lg font-black">Gold vs. Black</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Score label="Gold" value={totals.program?.gold ?? 0} tone="gold" />
            <Score label="Black" value={totals.program?.black ?? 0} tone="dark" />
          </div>
        </div>
      </section>

      <section className="rounded-md border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Players Needing Attention</h2>
          <UserRoundPlus aria-hidden size={20} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {needingAttention.map((player) => (
            <Link key={player.id} to={`/app/team/players/${player.id}`} className="rounded-md border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#D0B988]">
              <p className="font-black">#{player.jerseyNumber} {player.preferredName || player.firstName} {player.lastName}</p>
              <p className="text-sm text-zinc-700">{player.developmentFocus || player.availabilityStatus}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <div className="flex items-center gap-2 text-zinc-600">{icon}<span className="text-xs font-bold uppercase">{label}</span></div>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function Score({ label, value, tone }: { label: string; value: number; tone: "gold" | "dark" }) {
  return (
    <div className={`rounded-md p-4 ${tone === "gold" ? "bg-[#D0B988] text-black" : "bg-black text-white"}`}>
      <p className="text-sm font-black uppercase">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}
