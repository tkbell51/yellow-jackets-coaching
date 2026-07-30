import { useState } from "react";
import { queueLocalWrite } from "~/lib/offline/sync";
import { coachingNotes as seedNotes, players } from "~/lib/sample-data";
import type { CoachingNote } from "~/types/domain";

export default function NotesRoute() {
  const [notes, setNotes] = useState<CoachingNote[]>(seedNotes);

  async function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const now = new Date().toISOString();
    const note: CoachingNote = {
      id: crypto.randomUUID(),
      authorId: "coach-head",
      playerId: String(form.get("playerId") || "") || undefined,
      practiceId: "practice-today",
      category: form.get("category") as CoachingNote["category"],
      text: String(form.get("text") || ""),
      visibility: form.get("visibility") as CoachingNote["visibility"],
      resolved: false,
      createdAt: now,
      updatedAt: now,
      syncStatus: "pending",
    };
    setNotes((current) => [note, ...current]);
    await queueLocalWrite({ entityType: "coaching_notes", entityId: note.id, operation: "upsert", payload: note });
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addNote} className="rounded-md border border-zinc-200 bg-white p-4">
        <h1 className="text-xl font-black">Coaching Notes</h1>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold">Player
            <select name="playerId" className="mt-1 min-h-11 w-full rounded-md border border-zinc-300 px-3">
              <option value="">No player</option>
              {players.map((player) => <option key={player.id} value={player.id}>#{player.jerseyNumber} {player.firstName} {player.lastName}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold">Category
            <select name="category" className="mt-1 min-h-11 w-full rounded-md border border-zinc-300 px-3">
              <option value="private">Private</option>
              <option value="player_development">Player development</option>
              <option value="practice_follow_up">Practice follow-up</option>
            </select>
          </label>
          <label className="text-sm font-bold">Visibility
            <select name="visibility" className="mt-1 min-h-11 w-full rounded-md border border-zinc-300 px-3">
              <option value="head_coach_only">Head coach only</option>
              <option value="coordinators">Coordinators</option>
              <option value="all_coaches">All coaches</option>
            </select>
          </label>
        </div>
        <label className="mt-3 block text-sm font-bold">Note
          <textarea name="text" required className="mt-1 min-h-28 w-full rounded-md border border-zinc-300 p-3" />
        </label>
        <button className="mt-3 min-h-12 rounded-md bg-black px-4 font-black text-white">Save Note</button>
      </form>
      <section className="space-y-2">
        {notes.map((note) => (
          <article key={note.id} className="rounded-md border border-zinc-200 bg-white p-3">
            <p className="text-xs font-black uppercase text-zinc-600">{note.category.replaceAll("_", " ")} • {note.visibility.replaceAll("_", " ")}</p>
            <p className="mt-2 font-bold">{note.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
