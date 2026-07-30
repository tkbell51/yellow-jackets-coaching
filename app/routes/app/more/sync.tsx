import { OfflineStatus } from "~/components/offline/offline-status";

export default function SyncRoute() {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-4">
      <h1 className="text-xl font-black">Sync Status</h1>
      <p className="mt-2 text-sm text-zinc-700">Local sideline writes are queued in IndexedDB and retried when Supabase is configured and the device is online.</p>
      <div className="mt-4">
        <OfflineStatus />
      </div>
    </section>
  );
}
