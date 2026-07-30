import { AlertTriangle, CheckCircle2, CloudOff, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getSyncSummary, processSyncQueue } from "~/lib/offline/sync";

export function OfflineStatus() {
  const [online, setOnline] = useState(true);
  const [summary, setSummary] = useState({ pending: 0, syncing: 0, failed: 0 });

  useEffect(() => {
    let active = true;
    async function refresh() {
      if (!active) return;
      setOnline(navigator.onLine);
      setSummary(await getSyncSummary());
    }

    refresh();
    const interval = window.setInterval(refresh, 15000);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  let label = "Online — All changes synced";
  let Icon = CheckCircle2;
  if (!online) {
    label = `Offline — ${summary.pending} changes saved on this device`;
    Icon = CloudOff;
  } else if (summary.failed) {
    label = `Sync issue — ${summary.failed} change needs attention`;
    Icon = AlertTriangle;
  } else if (summary.syncing) {
    label = `Syncing — ${summary.syncing} uploading`;
    Icon = RefreshCw;
  } else if (summary.pending) {
    label = `Pending — ${summary.pending} unsynced changes waiting`;
    Icon = RefreshCw;
  }

  return (
    <button
      type="button"
      onClick={() => processSyncQueue().then(setSummary)}
      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-left text-xs font-bold text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D0B988]"
    >
      <Icon aria-hidden size={16} />
      <span>{label}</span>
    </button>
  );
}
