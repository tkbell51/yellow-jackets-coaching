import { NavLink } from "react-router";

export function SectionTabs({ items }: { items: Array<{ to: string; label: string; end?: boolean }> }) {
  return (
    <nav className="mb-4 flex gap-2 overflow-x-auto pb-1" aria-label="Section navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex min-h-11 shrink-0 items-center rounded-md border px-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#D0B988] ${
              isActive ? "border-black bg-black text-white" : "border-zinc-300 bg-white text-zinc-950"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
