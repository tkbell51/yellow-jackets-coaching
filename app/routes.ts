import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("app", "routes/app/layout.tsx", [
    index("routes/app/dashboard.tsx"),
    route("practice", "routes/app/practice/layout.tsx", [
      index("routes/app/practice/index.tsx"),
      route("plans", "routes/app/practice/plans.tsx"),
      route("groups", "routes/app/practice/groups.tsx"),
      route("competition", "routes/app/practice/competition.tsx"),
      route(":practiceId", "routes/app/practice/detail.tsx"),
      route(":practiceId/run", "routes/app/practice/run.tsx"),
    ]),
    route("game-day", "routes/app/game-day.tsx"),
    route("team", "routes/app/team/layout.tsx", [
      index("routes/app/team/index.tsx"),
      route("players", "routes/app/team/players.tsx"),
      route("players/:playerId", "routes/app/team/player-detail.tsx"),
      route("depth-charts", "routes/app/team/depth-charts.tsx"),
      route("packages", "routes/app/team/packages.tsx"),
      route("captains", "routes/app/team/captains.tsx"),
      route("coaches", "routes/app/team/coaches.tsx"),
    ]),
    route("more", "routes/app/more/layout.tsx", [
      index("routes/app/more/index.tsx"),
      route("notes", "routes/app/more/notes.tsx"),
      route("reports", "routes/app/more/reports.tsx"),
      route("equipment", "routes/app/more/equipment.tsx"),
      route("fields", "routes/app/more/fields.tsx"),
      route("roles", "routes/app/more/roles.tsx"),
      route("settings", "routes/app/more/settings.tsx"),
      route("sync", "routes/app/more/sync.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
