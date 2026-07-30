import { Link } from "react-router";
import { calculatePracticeMinutes } from "~/features/practice/calculations";
import { practicePeriods, practices } from "~/lib/sample-data";

export default function PracticePlans() {
  return (
    <div className="space-y-3">
      {practices.map((practice) => {
        const periods = practicePeriods.filter((period) => period.practiceId === practice.id);
        return (
          <article key={practice.id} className="rounded-md border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-black">{practice.name}</h1>
                <p className="text-sm text-zinc-700">{calculatePracticeMinutes(periods)} minutes • {practice.status}</p>
              </div>
              <Link to={`/app/practice/${practice.id}`} className="inline-flex min-h-11 items-center rounded-md bg-black px-4 text-sm font-black text-white">
                Open Plan
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
