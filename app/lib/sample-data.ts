import type {
  AgeGroup,
  AttendanceRecord,
  Coach,
  CoachingNote,
  CompetitionEvent,
  Player,
  Practice,
  PracticePeriod,
  Program,
} from "~/types/domain";

export const program: Program = {
  id: "program-yellow-jackets",
  name: "Yellow Jackets Coaching",
  shortName: "Jackets",
};

export const ageGroups: AgeGroup[] = [
  { id: "age-8u", programId: program.id, name: "8U", minimumPlays: 4 },
  { id: "age-10u", programId: program.id, name: "10U", minimumPlays: 0 },
];

export const coaches: Coach[] = [
  {
    id: "coach-head",
    name: "Marcus Carter",
    email: "head.coach@example.com",
    role: "head_coach",
    assignedAgeGroupIds: ["age-8u", "age-10u"],
    responsibilities: ["Program settings", "Depth charts", "Game day"],
    active: true,
  },
  {
    id: "coach-oc",
    name: "Andre Miles",
    email: "offense@example.com",
    role: "offensive_coordinator",
    assignedAgeGroupIds: ["age-8u", "age-10u"],
    responsibilities: ["Offense", "Install periods"],
    active: true,
  },
  {
    id: "coach-dc",
    name: "Elliot Harris",
    email: "defense@example.com",
    role: "defensive_coordinator",
    assignedAgeGroupIds: ["age-8u", "age-10u"],
    responsibilities: ["Defense", "Tackle circuit"],
    active: true,
  },
  {
    id: "coach-assistant",
    name: "Troy Bennett",
    email: "assistant@example.com",
    role: "assistant_coach",
    assignedAgeGroupIds: ["age-8u"],
    responsibilities: ["Attendance", "E.A.T. recognition"],
    active: true,
  },
];

const now = new Date("2026-07-30T09:00:00.000Z").toISOString();

export const players: Player[] = [
  ["p8-1", "Jayden", "Brooks", 2, "age-8u", "gold", "QB", "S"],
  ["p8-2", "Miles", "Turner", 5, "age-8u", "black", "RB", "LB"],
  ["p8-3", "Noah", "Parker", 7, "age-8u", "gold", "WR", "CB"],
  ["p8-4", "Caleb", "Reed", 10, "age-8u", "black", "TE", "DE"],
  ["p8-5", "Isaiah", "Bell", 12, "age-8u", "gold", "OL", "DT"],
  ["p8-6", "Owen", "Grant", 21, "age-8u", "black", "RB", "S"],
  ["p8-7", "Elijah", "Cole", 33, "age-8u", "gold", "OL", "NG"],
  ["p8-8", "Mason", "Young", 44, "age-8u", "black", "WR", "CB"],
  ["p10-1", "Cameron", "Scott", 1, "age-10u", "gold", "QB", "FS"],
  ["p10-2", "Landon", "White", 3, "age-10u", "black", "RB", "LB"],
  ["p10-3", "Micah", "James", 8, "age-10u", "gold", "WR", "CB"],
  ["p10-4", "Dylan", "Cooper", 11, "age-10u", "black", "TE", "DE"],
  ["p10-5", "Jordan", "Hayes", 15, "age-10u", "gold", "C", "DT"],
  ["p10-6", "Levi", "Morgan", 24, "age-10u", "black", "RB", "S"],
  ["p10-7", "Aiden", "Price", 55, "age-10u", "gold", "G", "NG"],
  ["p10-8", "Tyler", "Ross", 81, "age-10u", "black", "WR", "CB"],
].map(([id, firstName, lastName, jerseyNumber, ageGroupId, competitionTeam, offense, defense]) => ({
  id: String(id),
  firstName: String(firstName),
  lastName: String(lastName),
  preferredName: undefined,
  jerseyNumber: Number(jerseyNumber),
  ageGroupId: String(ageGroupId),
  competitionTeam: competitionTeam as "gold" | "black",
  active: true,
  availabilityStatus: "active",
  primaryOffensePosition: String(offense),
  backupOffensePositions: [],
  primaryDefensePosition: String(defense),
  backupDefensePositions: [],
  generalNotes: "",
  developmentFocus: "E.A.T. consistency",
  createdAt: now,
  updatedAt: now,
}));

export const practices: Practice[] = [
  {
    id: "practice-template-90",
    programId: program.id,
    name: "Default 90-Minute Template",
    date: "2026-07-30",
    startTime: "18:00",
    endTime: "19:30",
    ageGroupIds: ["age-8u", "age-10u"],
    status: "template",
    field: "Main Field",
    equipment: ["Cones", "Shields", "Football bags"],
    notes: "Reusable base template.",
    createdBy: "coach-head",
  },
  {
    id: "practice-today",
    programId: program.id,
    name: "Thursday Practice",
    date: "2026-07-30",
    startTime: "18:00",
    endTime: "19:30",
    ageGroupIds: ["age-8u", "age-10u"],
    status: "scheduled",
    field: "Main Field",
    equipment: ["Cones", "Whistles", "Tackle wheel"],
    notes: "Tempo, finish, E.A.T.",
    createdBy: "coach-head",
  },
];

const periodNames = [
  ["Two Lines", 10],
  ["Fundamentals Stations", 15],
  ["Position Indy", 15],
  ["Install / Group", 15],
  ["Team / Scout", 20],
  ["Competitive Game", 10],
  ["E.A.T. Breakdown", 5],
] as const;

export const practicePeriods: PracticePeriod[] = practices.flatMap((practice) => {
  let offset = 0;
  return periodNames.map(([name, duration], index) => {
    const period: PracticePeriod = {
      id: `${practice.id}-period-${index + 1}`,
      practiceId: practice.id,
      name,
      order: index + 1,
      startOffsetMinutes: offset,
      durationMinutes: duration,
      ageGroupId: index % 2 === 0 ? "age-8u" : "age-10u",
      fieldArea: index < 3 ? "North hash" : "Main field",
      assignedCoachIds: index < 3 ? ["coach-oc", "coach-assistant"] : ["coach-head", "coach-dc"],
      assignedPlayerGroupIds: [],
      equipment: index === 5 ? ["Tackle wheel", "Cones"] : ["Cones"],
      coachingPoints: ["Fast transitions", "Clear finish", "E.A.T. language"],
      competitionEnabled: index === 5 || index === 6,
      scoringRules: index === 5 ? "Winner +3" : "Recognition +1",
    };
    offset += duration;
    return period;
  });
});

export const attendanceRecords: AttendanceRecord[] = players.slice(0, 10).map((player, index) => ({
  id: `attendance-${player.id}`,
  playerId: player.id,
  practiceId: "practice-today",
  status: index === 3 ? "absent" : "present",
  recordedBy: "coach-assistant",
  recordedAt: now,
  syncStatus: "synced",
}));

export const competitionEvents: CompetitionEvent[] = [
  {
    id: "event-1",
    programId: program.id,
    practiceId: "practice-today",
    ageGroupId: "age-8u",
    competitionTeam: "gold",
    pointType: "recognition",
    reason: "Effort",
    pointValue: 1,
    playerId: "p8-1",
    awardedBy: "coach-head",
    awardedAt: now,
    voided: false,
    syncStatus: "synced",
  },
  {
    id: "event-2",
    programId: program.id,
    practiceId: "practice-today",
    ageGroupId: "age-10u",
    competitionTeam: "black",
    pointType: "competition",
    reason: "Football Baseball",
    pointValue: 3,
    awardedBy: "coach-dc",
    awardedAt: now,
    voided: false,
    syncStatus: "synced",
  },
];

export const coachingNotes: CoachingNote[] = [
  {
    id: "note-1",
    authorId: "coach-head",
    playerId: "p8-2",
    practiceId: "practice-today",
    category: "player_development",
    text: "Good response after correction. Keep reinforcing first-step urgency.",
    visibility: "coordinators",
    resolved: false,
    createdAt: now,
    updatedAt: now,
  },
];
