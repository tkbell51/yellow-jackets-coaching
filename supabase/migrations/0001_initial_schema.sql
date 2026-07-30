create extension if not exists "pgcrypto";

create type competition_team as enum ('gold', 'black');
create type availability_status as enum ('active', 'absent', 'injured', 'ineligible', 'unavailable');
create type coach_role as enum ('head_coach', 'offensive_coordinator', 'defensive_coordinator', 'assistant_defensive_coordinator', 'assistant_coach', 'play_counter');
create type point_type as enum ('recognition', 'competition', 'adjustment');
create type sync_status as enum ('pending', 'syncing', 'synced', 'failed');

create table programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table age_groups (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  name text not null check (name in ('8U', '10U')),
  minimum_plays integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, name)
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table program_members (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role coach_role not null,
  assigned_age_group_ids uuid[] not null default '{}',
  responsibilities text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, profile_id)
);

create table players (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  age_group_id uuid not null references age_groups(id),
  first_name text not null,
  last_name text not null,
  preferred_name text,
  jersey_number integer not null check (jersey_number between 0 and 99),
  competition_team competition_team not null,
  active boolean not null default true,
  availability_status availability_status not null default 'active',
  primary_offense_position text not null,
  backup_offense_positions text[] not null default '{}',
  primary_defense_position text not null,
  backup_defense_positions text[] not null default '{}',
  general_notes text,
  development_focus text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (age_group_id, jersey_number)
);

create table practices (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  name text not null,
  practice_date date not null,
  start_time time not null,
  end_time time not null,
  age_group_ids uuid[] not null,
  status text not null check (status in ('template', 'scheduled', 'running', 'completed')),
  field text,
  equipment text[] not null default '{}',
  notes text,
  follow_up_notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table practice_templates (like practices including all);

create table practice_periods (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  name text not null,
  period_order integer not null,
  start_offset_minutes integer not null default 0,
  duration_minutes integer not null check (duration_minutes > 0),
  age_group_id uuid references age_groups(id),
  field_area text,
  assigned_player_group_ids uuid[] not null default '{}',
  equipment text[] not null default '{}',
  coaching_points text[] not null default '{}',
  drill_notes text,
  competition_enabled boolean not null default false,
  scoring_rules text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table practice_period_coaches (
  practice_period_id uuid references practice_periods(id) on delete cascade,
  program_member_id uuid references program_members(id) on delete cascade,
  primary key (practice_period_id, program_member_id)
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  practice_id uuid not null references practices(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'injured', 'ineligible', 'unavailable')),
  recorded_by uuid references profiles(id),
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table competition_events (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  practice_id uuid references practices(id) on delete set null,
  age_group_id uuid not null references age_groups(id),
  competition_team competition_team not null,
  point_type point_type not null,
  reason text not null,
  point_value integer not null check (point_value <> 0),
  player_id uuid references players(id) on delete set null,
  note text,
  awarded_by uuid references profiles(id),
  awarded_at timestamptz not null default now(),
  voided boolean not null default false,
  created_at timestamptz not null default now()
);

create table coaching_notes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  author_id uuid references profiles(id),
  player_id uuid references players(id) on delete set null,
  practice_id uuid references practices(id) on delete set null,
  category text not null check (category in ('private', 'player_development', 'practice_follow_up')),
  body text not null,
  visibility text not null check (visibility in ('head_coach_only', 'coordinators', 'all_coaches')),
  follow_up_date date,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table coach_assignments (id uuid primary key default gen_random_uuid(), program_id uuid not null references programs(id) on delete cascade, program_member_id uuid references program_members(id), assignment_type text not null, created_at timestamptz default now());
create table app_settings (id uuid primary key default gen_random_uuid(), program_id uuid not null references programs(id) on delete cascade, key text not null, value jsonb not null default '{}', unique(program_id, key));
create table depth_charts (id uuid primary key default gen_random_uuid(), program_id uuid not null references programs(id) on delete cascade, age_group_id uuid references age_groups(id), side text check (side in ('offense','defense')), name text not null);
create table depth_chart_entries (id uuid primary key default gen_random_uuid(), depth_chart_id uuid references depth_charts(id) on delete cascade, player_id uuid references players(id), position text not null, status text check (status in ('starter','rotation','emergency')), chart_order integer not null default 0);
create table personnel_packages (id uuid primary key default gen_random_uuid(), program_id uuid references programs(id) on delete cascade, name text not null);
create table personnel_package_players (package_id uuid references personnel_packages(id) on delete cascade, player_id uuid references players(id), primary key(package_id, player_id));
create table games (id uuid primary key default gen_random_uuid(), program_id uuid references programs(id) on delete cascade, age_group_id uuid references age_groups(id), opponent text, game_date date, status text);
create table game_players (id uuid primary key default gen_random_uuid(), game_id uuid references games(id) on delete cascade, player_id uuid references players(id), availability_status availability_status not null default 'active');
create table game_captains (id uuid primary key default gen_random_uuid(), game_id uuid references games(id) on delete cascade, player_id uuid references players(id), captain_type text);
create table snap_events (id uuid primary key default gen_random_uuid(), game_id uuid references games(id) on delete cascade, unit text check (unit in ('offense','defense','special_teams')), snap_number integer not null, voided boolean default false, created_at timestamptz default now());
create table lineups (id uuid primary key default gen_random_uuid(), game_id uuid references games(id) on delete cascade, name text not null, unit text);
create table lineup_players (lineup_id uuid references lineups(id) on delete cascade, player_id uuid references players(id), position text, primary key(lineup_id, player_id));

alter table programs enable row level security;
alter table age_groups enable row level security;
alter table profiles enable row level security;
alter table program_members enable row level security;
alter table players enable row level security;
alter table practices enable row level security;
alter table practice_templates enable row level security;
alter table practice_periods enable row level security;
alter table practice_period_coaches enable row level security;
alter table attendance_records enable row level security;
alter table competition_events enable row level security;
alter table coaching_notes enable row level security;
alter table coach_assignments enable row level security;
alter table app_settings enable row level security;
alter table depth_charts enable row level security;
alter table depth_chart_entries enable row level security;
alter table personnel_packages enable row level security;
alter table personnel_package_players enable row level security;
alter table games enable row level security;
alter table game_players enable row level security;
alter table game_captains enable row level security;
alter table snap_events enable row level security;
alter table lineups enable row level security;
alter table lineup_players enable row level security;

create or replace function is_active_program_member(target_program_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from program_members
    where program_id = target_program_id and profile_id = auth.uid() and active = true
  );
$$;

create or replace function is_head_coach(target_program_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from program_members
    where program_id = target_program_id and profile_id = auth.uid() and role = 'head_coach' and active = true
  );
$$;

create policy "members read programs" on programs for select using (is_active_program_member(id));
create policy "head coaches manage programs" on programs for all using (is_head_coach(id)) with check (is_head_coach(id));
create policy "members read players" on players for select using (is_active_program_member(program_id));
create policy "head coaches manage players" on players for all using (is_head_coach(program_id)) with check (is_head_coach(program_id));
create policy "members read practices" on practices for select using (is_active_program_member(program_id));
create policy "members write practices" on practices for all using (is_active_program_member(program_id)) with check (is_active_program_member(program_id));
create policy "members read competition" on competition_events for select using (is_active_program_member(program_id));
create policy "members award competition" on competition_events for insert with check (is_active_program_member(program_id));
create policy "members void competition" on competition_events for update using (is_active_program_member(program_id));
create policy "members read notes" on coaching_notes for select using (is_active_program_member(program_id) and visibility <> 'head_coach_only' or is_head_coach(program_id));
create policy "members create notes" on coaching_notes for insert with check (is_active_program_member(program_id));
