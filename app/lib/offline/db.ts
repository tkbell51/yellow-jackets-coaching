import Dexie, { type Table } from "dexie";
import type {
  AttendanceRecord,
  CoachingNote,
  CompetitionEvent,
  Player,
  Practice,
  PracticePeriod,
  SyncQueueItem,
} from "~/types/domain";

export class JacketsLocalDatabase extends Dexie {
  players!: Table<Player, string>;
  practices!: Table<Practice, string>;
  practicePeriods!: Table<PracticePeriod, string>;
  games!: Table<Record<string, unknown>, string>;
  gamePlayers!: Table<Record<string, unknown>, string>;
  lineups!: Table<Record<string, unknown>, string>;
  snapEvents!: Table<Record<string, unknown>, string>;
  attendanceEvents!: Table<AttendanceRecord, string>;
  competitionEvents!: Table<CompetitionEvent, string>;
  coachingNotes!: Table<CoachingNote, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  appState!: Table<{ id: string; value: unknown }, string>;

  constructor() {
    super("yellow-jackets-coaching");
    this.version(1).stores({
      players: "id, ageGroupId, competitionTeam, active",
      practices: "id, status, date",
      practicePeriods: "id, practiceId, order",
      games: "id, date",
      gamePlayers: "id, gameId, playerId",
      lineups: "id, gameId",
      snapEvents: "id, gameId, createdAt",
      attendanceEvents: "id, playerId, practiceId, status, syncStatus",
      competitionEvents: "id, practiceId, ageGroupId, competitionTeam, syncStatus",
      coachingNotes: "id, playerId, practiceId, visibility, syncStatus",
      syncQueue: "id, entityType, entityId, status, createdAt",
      appState: "id",
    });
  }
}

export const db = new JacketsLocalDatabase();
