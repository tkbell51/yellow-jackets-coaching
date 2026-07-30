import { Link } from "react-router";
import type { Route } from "./+types/detail";
import { calculatePracticeMinutes, reorderPeriod } from "~/features/practice/calculations";
import { practicePeriods, practices } from "~/lib/sample-data";

export default function PracticeDetail({ params }: Route.ComponentProps) {
  const practice = practices.find((item) => item.id === params.practiceId) ?? practices[0];
  const periods = practicePeriods.filter((period) => period.practiceId === practice.id).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white p-4">
        <h1 className="text-2xl font-black">{practice.name}</h1>
        <p className="text-sm text-zinc-700">{calculatePracticeMinutes(periods)} minutes • {practice.field}</p>
        <Link to={`/app/practice/${practice.id}/run`} className="mt-4 inline-flex min-h-12 items-center rounded-md bg-black px-4 font-black text-white">
          Start Practice
        </Link>
      </section>
      <section className="space-y-2">
        {periods.map((period) => (
          <article key={period.id} className="rounded-md border border-zinc-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">{period.order}. {period.name}</p>
                <p className="text-sm text-zinc-700">{period.durationMinutes} min • {period.fieldArea}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => reorderPeriod(periods, period.id, "up")} className="min-h-10 rounded-md border px-3 text-sm font-black">Up</button>
                <button onClick={() => reorderPeriod(periods, period.id, "down")} className="min-h-10 rounded-md border px-3 text-sm font-black">Down</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-700">{period.coachingPoints.join(" • ")}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
