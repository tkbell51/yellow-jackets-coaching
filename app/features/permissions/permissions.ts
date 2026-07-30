import type { Coach, CoachRole } from "~/types/domain";

const rolePermissions: Record<CoachRole, string[]> = {
  head_coach: ["*"],
  offensive_coordinator: ["practice:manage", "players:view", "competition:award", "notes:create", "depth:offense"],
  defensive_coordinator: ["practice:manage", "players:view", "competition:award", "notes:create", "depth:defense"],
  assistant_defensive_coordinator: ["players:view", "competition:award", "notes:create", "depth:defense"],
  assistant_coach: ["practice:view", "attendance:record", "competition:award", "notes:create", "players:view"],
  play_counter: ["game:participation", "players:view"],
};

export function can(coach: Coach | undefined, permission: string) {
  if (!coach?.active) return false;
  const permissions = rolePermissions[coach.role] ?? [];
  return permissions.includes("*") || permissions.includes(permission);
}
