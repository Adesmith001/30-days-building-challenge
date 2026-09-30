create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  archived boolean not null default false,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,

  project_id uuid null,
  continued_from_session_id uuid null,

  outcome text not null,
  definition_of_done text not null,
  first_action text not null,
  current_next_action text not null,
  not_doing text,

  resources jsonb not null default '[]',

  mode text not null check (mode in ('timed', 'open')),
  planned_duration_seconds integer,

  status text not null,
  result_status text,

  started_at timestamptz,
  ended_at timestamptz,

  pause_started_at timestamptz,
  break_started_at timestamptz,
  break_ends_at timestamptz,

  total_paused_ms bigint not null default 0,
  total_break_ms bigint not null default 0,

  completion_note text,
  final_next_step text,
  blocker text,
  direction_change text,

  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists session_events (
  id uuid primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  timestamp timestamptz not null,
  metadata jsonb not null default '{}'
);

create table if not exists checkpoints (
  id uuid primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text not null,
  next_action text not null,
  created_at timestamptz not null
);

create table if not exists parked_items (
  id uuid primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  resolved boolean not null default false,
  created_at timestamptz not null
);

create table if not exists daily_plans (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  items jsonb not null default '[]',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table sessions enable row level security;
alter table session_events enable row level security;
alter table checkpoints enable row level security;
alter table parked_items enable row level security;
alter table daily_plans enable row level security;

create policy "Own profile"
on profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Own projects"
on projects
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Own sessions"
on sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Own session events"
on session_events
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Own checkpoints"
on checkpoints
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Own parked items"
on parked_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Own daily plans"
on daily_plans
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists sessions_user_id_idx
  on sessions(user_id);

create index if not exists events_session_id_idx
  on session_events(session_id);

create index if not exists events_user_id_idx
  on session_events(user_id);

create index if not exists checkpoints_session_id_idx
  on checkpoints(session_id);

create index if not exists parked_items_session_id_idx
  on parked_items(session_id);