import { Badge } from "~/components/ui/badge";
import { ageGroups, coaches } from "~/lib/sample-data";

export default function CoachesRoute() {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {coaches.map((coach) => (
        <article key={coach.id} className="rounded-md border border-zinc-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-black">{coach.name}</h1>
              <p className="text-sm text-zinc-700">{coach.email}</p>
            </div>
            <Badge tone={coach.active ? "success" : "warning"}>{coach.active ? "Active" : "Inactive"}</Badge>
          </div>
          <p className="mt-3 text-sm font-black capitalize">{coach.role.replaceAll("_", " ")}</p>
          <p className="mt-1 text-sm text-zinc-700">{coach.responsibilities.join(" • ")}</p>
          <div className="mt-3 flex gap-2">
            {coach.assignedAgeGroupIds.map((id) => <Badge key={id}>{ageGroups.find((group) => group.id === id)?.name}</Badge>)}
          </div>
        </article>
      ))}
    </section>
  );
}
