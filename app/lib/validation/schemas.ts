import { z } from "zod";

export const playerSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  preferredName: z.string().optional(),
  jerseyNumber: z.coerce.number().int().min(0).max(99),
  ageGroupId: z.string().min(1, "Choose an age group."),
  competitionTeam: z.enum(["gold", "black"]),
  availabilityStatus: z.enum(["active", "absent", "injured", "ineligible", "unavailable"]),
  primaryOffensePosition: z.string().min(1, "Add an offensive position."),
  primaryDefensePosition: z.string().min(1, "Add a defensive position."),
  developmentFocus: z.string().optional(),
});

export const competitionPointSchema = z.object({
  ageGroupId: z.string().min(1),
  competitionTeam: z.enum(["gold", "black"]),
  pointValue: z.coerce.number().int().min(-20).max(20).refine((value) => value !== 0, "Point value cannot be zero."),
  reason: z.string().min(1),
});

export const practicePeriodSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(1).max(120),
});
