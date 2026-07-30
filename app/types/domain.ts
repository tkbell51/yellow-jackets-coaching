export type AgeGroupName = "8U" | "10U";
export type CompetitionTeam = "gold" | "black";
export type AvailabilityStatus =
  | "active"
  | "absent"
  | "injured"
  | "ineligible"
  | "unavailable";
export type CoachRole =
  | "head_coach"
  | "offensive_coordinator"
  | "defensive_coordinator"
  | "assistant_defensive_coordinator"
  | "assistant_coach"
  | "play_counter";
export type PointType = "recognition" | "competition" | "adjustment";
export type RecognitionReason = "Effort" | "Attitude" | "Toughness";
export type CompetitionReason =
  | "Period Win"
  | "Drill Win"
  | "Duck Duck Tackle Relay"
  | "Football Baseball"
  | "Tackle Wheel Gladiator"
  | "Practice Champion"
  | "Other";
export type AttendanceStatus =
  | "present"
  | "absent"
  | "injured"
  | "ineligible"
  | "unavailable";
export type PracticeStatus = "template" | "scheduled" | "running" | "completed";
export type SyncStatus = "pending" | "syncing" | "synced" | "failed";

export interface Program {
  id: string;
  name: string;
  shortName: string;
}

export interface AgeGroup {
  id: string;
  programId: string;
  name: AgeGroupName;
  minimumPlays: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  jerseyNumber: number;
  ageGroupId: string;
  competitionTeam: CompetitionTeam;
  active: boolean;
  availabilityStatus: AvailabilityStatus;
  primaryOffensePosition: string;
  backupOffensePositions: string[];
  primaryDefensePosition: string;
  backupDefensePositions: string[];
  generalNotes?: string;
  developmentFocus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  role: CoachRole;
  assignedAgeGroupIds: string[];
  responsibilities: string[];
  active: boolean;
}

export interface Practice {
  id: string;
  programId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  ageGroupIds: string[];
  status: PracticeStatus;
  field: string;
  equipment: string[];
  notes?: string;
  followUpNotes?: string;
  createdBy: string;
}

export interface PracticePeriod {
  id: string;
  practiceId: string;
  name: string;
  order: number;
  startOffsetMinutes: number;
  durationMinutes: number;
  ageGroupId?: string;
  fieldArea: string;
  assignedCoachIds: string[];
  assignedPlayerGroupIds: string[];
  equipment: string[];
  coachingPoints: string[];
  drillNotes?: string;
  competitionEnabled: boolean;
  scoringRules?: string;
}

export interface AttendanceRecord {
  id: string;
  playerId: string;
  practiceId: string;
  status: AttendanceStatus;
  recordedBy: string;
  recordedAt: string;
  syncStatus?: SyncStatus;
}

export interface CompetitionEvent {
  id: string;
  programId: string;
  practiceId?: string;
  ageGroupId: string;
  competitionTeam: CompetitionTeam;
  pointType: PointType;
  reason: RecognitionReason | CompetitionReason | "Manual Adjustment";
  pointValue: number;
  playerId?: string;
  note?: string;
  awardedBy: string;
  awardedAt: string;
  voided: boolean;
  syncStatus?: SyncStatus;
}

export interface CoachingNote {
  id: string;
  authorId: string;
  playerId?: string;
  practiceId?: string;
  category: "private" | "player_development" | "practice_follow_up";
  text: string;
  visibility: "head_coach_only" | "coordinators" | "all_coaches";
  followUpDate?: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus?: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  entityType:
    | "attendance_records"
    | "competition_events"
    | "coaching_notes"
    | "players"
    | "practices"
    | "snap_events";
  entityId: string;
  operation: "upsert" | "delete" | "void";
  payload: unknown;
  createdAt: string;
  attemptCount: number;
  lastAttemptAt?: string;
  lastError?: string;
  status: SyncStatus;
}
