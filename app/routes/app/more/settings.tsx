import { ageGroups } from "~/lib/sample-data";

export default function Settings() {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-4">
      <h1 className="text-xl font-black">Program Settings</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ageGroups.map((group) => (
          <div key={group.id} className="rounded-md border border-zinc-200 p-3">
            <p className="font-black">{group.name}</p>
            <p className="text-sm text-zinc-700">Minimum game plays: {group.minimumPlays}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
