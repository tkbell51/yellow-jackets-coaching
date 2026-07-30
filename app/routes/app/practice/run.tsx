import { ArrowLeft, ArrowRight, ClipboardCheck, Pause, Play, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/run";
import { coaches, practicePeriods, practices } from "~/lib/sample-data";

export default function PracticeRun({ params }: Route.ComponentProps) {
  const practice = practices.find((item) => item.id === params.practiceId) ?? practices[0];
  const periods = useMemo(() => practicePeriods.filter((period) => period.practiceId === practice.id).sort((a, b) => a.order - b.order), [practice.id]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = periods[index] ?? periods[0];
  const assigned = coaches.filter((coach) => current.assignedCoachIds.includes(coach.id)).map((coach) => coach.name).join(", ");

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-black p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-[#D0B988]">Sideline Mode</p>
          <h1 className="text-2xl font-black">{practice.name}</h1>
        </div>
        <Link to="/app/practice" className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-black">Exit</Link>
      </div>

      <section className="mt-5 rounded-md border border-zinc-700 bg-zinc-950 p-4">
        <p className="text-sm font-black text-zinc-300">Period {current.order} of {periods.length}</p>
        <h2 className="mt-1 text-4xl font-black tracking-normal">{current.name}</h2>
        <p className="mt-4 text-6xl font-black text-[#D0B988]">{current.durationMinutes}:00</p>
        <div className="mt-4 grid gap-2 text-sm text-zinc-200">
          <p><strong>Field:</strong> {current.fieldArea}</p>
          <p><strong>Coaches:</strong> {assigned}</p>
          <p><strong>Equipment:</strong> {current.equipment.join(", ")}</p>
          <p><strong>Coaching:</strong> {current.coachingPoints.join(" • ")}</p>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-zinc-700 font-black disabled:opacity-40">
          <ArrowLeft aria-hidden size={18} /> Prev
        </button>
        <button onClick={() => setPaused((value) => !value)} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#D0B988] font-black text-black">
          {paused ? <Play aria-hidden size={18} /> : <Pause aria-hidden size={18} />} {paused ? "Resume" : "Pause"}
        </button>
        <button disabled={index === periods.length - 1} onClick={() => setIndex((value) => Math.min(periods.length - 1, value + 1))} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-zinc-700 font-black disabled:opacity-40">
          Next <ArrowRight aria-hidden size={18} />
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-16 grid grid-cols-4 border-t border-zinc-700 bg-zinc-950 lg:bottom-0 lg:left-72">
        <Link to="/app/practice" className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-black"><ClipboardCheck size={20} /> Attendance</Link>
        <Link to="/app/practice/competition" className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-black"><Trophy size={20} /> Award Points</Link>
        <Link to="/app/more/notes" className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-black">Notes</Link>
        <button className="min-h-16 text-xs font-black">More</button>
      </div>
    </div>
  );
}
