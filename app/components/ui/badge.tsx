export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "gold" | "dark" | "success" | "warning" | "neutral" }) {
  const tones = {
    gold: "border-[#8a6f2f] bg-[#D0B988] text-black",
    dark: "border-zinc-700 bg-black text-white",
    success: "border-emerald-700 bg-emerald-100 text-emerald-950",
    warning: "border-amber-700 bg-amber-100 text-amber-950",
    neutral: "border-zinc-300 bg-white text-zinc-900",
  };

  return (
    <span className={`inline-flex min-h-7 items-center rounded-md border px-2 text-xs font-bold uppercase tracking-normal ${tones[tone]}`}>
      {children}
    </span>
  );
}
