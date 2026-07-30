import { Hammer } from "lucide-react";

export function ComingSoon({ title, details = "Coming in Phase 2. The route is established so the sideline workflow can grow without navigation churn." }: { title: string; details?: string }) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-black p-2 text-[#D0B988]">
          <Hammer aria-hidden size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-zinc-950">{title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-700">{details}</p>
        </div>
      </div>
    </section>
  );
}
