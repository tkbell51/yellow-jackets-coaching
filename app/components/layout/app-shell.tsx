import { CalendarDays, Dumbbell, Home, MoreHorizontal, Shield, Users } from "lucide-react";
import { Navigate, NavLink, Outlet } from "react-router";
import { OfflineStatus } from "~/components/offline/offline-status";
import { AuthProvider, useAuth } from "~/features/auth/auth-context";

const navItems = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/practice", label: "Practice", icon: Dumbbell },
  { to: "/app/game-day", label: "Game Day", icon: CalendarDays },
  { to: "/app/team", label: "Team", icon: Users },
  { to: "/app/more", label: "More", icon: MoreHorizontal },
];

function ShellContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-zinc-100 p-6 text-zinc-950">Loading Yellow Jackets Coaching...</main>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-black p-4 text-white lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-md bg-[#D0B988] text-black">
            <Shield aria-hidden size={26} />
          </div>
          <div>
            <p className="text-base font-black">Yellow Jackets</p>
            <p className="text-xs font-bold uppercase text-zinc-300">Coaching</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app"}
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D0B988] ${
                  isActive ? "bg-[#D0B988] text-black" : "text-zinc-200 hover:bg-zinc-900"
                }`
              }
            >
              <Icon aria-hidden size={21} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-zinc-600">Jackets</p>
              <p className="text-sm font-bold text-zinc-950">{user.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <OfflineStatus />
              <button
                type="button"
                onClick={() => signOut()}
                className="min-h-10 rounded-md bg-black px-3 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-[#D0B988]"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4 lg:pb-8">
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-zinc-300 bg-black text-white lg:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app"}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#D0B988] ${
                  isActive ? "bg-[#D0B988] text-black" : "text-zinc-100"
                }`
              }
            >
              <Icon aria-hidden size={22} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <AuthProvider>
      <ShellContent />
    </AuthProvider>
  );
}
