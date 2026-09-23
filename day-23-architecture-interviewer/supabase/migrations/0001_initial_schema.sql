create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Chat',
  interview_stage text not null default 'understand',
  interview_state jsonb not null default '{
    "stage": "understand",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "assumptions": [],
    "decisions": [],
    "unresolvedQuestions": [],
    "risks": [],
    "constraints": [],
    "scale": {},
    "discussedTopics": [],
    "contradictions": []
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,
  user_id uuid not null
    references auth.users(id)
    on delete cascade,
  role text not null
    check (role in ('user', 'assistant', 'system_internal')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  sequence_number integer not null,
  client_request_id uuid,
  created_at timestamptz not null default now(),

  unique (conversation_id, sequence_number)
);

create table public.conversation_summaries (
  conversation_id uuid primary key
    references public.conversations(id)
    on delete cascade,
  summary text not null default '',
  structured_summary jsonb not null default '{}'::jsonb,
  through_sequence integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.api_rate_limits (
  user_id uuid not null
    references auth.users(id)
    on delete cascade,
  bucket text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),

  primary key (user_id, bucket)
);
create index conversations_user_updated_idx
  on public.conversations(user_id, updated_at desc);

create index messages_conversation_sequence_idx
  on public.messages(conversation_id, sequence_number);

create index messages_user_idx
  on public.messages(user_id);

create unique index messages_request_id_idx
  on public.messages(user_id, client_request_id)
  where client_request_id is not null;

create index messages_content_search_idx
  on public.messages
  using gin(to_tsvector('english', content));
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create trigger summaries_set_updated_at
before update on public.conversation_summaries
for each row execute function public.set_updated_at();

create trigger rate_limits_set_updated_at
before update on public.api_rate_limits
for each row execute function public.set_updated_at();
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
create or replace function public.insert_user_message(
  p_conversation_id uuid,
  p_content text,
  p_client_request_id uuid
)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_existing public.messages;
  v_next_sequence integer;
  v_message public.messages;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1
    from public.conversations
    where id = p_conversation_id
      and user_id = v_user_id
  ) then
    raise exception 'Conversation not found';
  end if;

  if p_client_request_id is not null then
    select *
    into v_existing
    from public.messages
    where user_id = v_user_id
      and client_request_id = p_client_request_id
    limit 1;

    if found then
      return v_existing;
    end if;
  end if;

  perform 1
  from public.conversations
  where id = p_conversation_id
    and user_id = v_user_id
  for update;

  select coalesce(max(sequence_number), 0) + 1
  into v_next_sequence
  from public.messages
  where conversation_id = p_conversation_id;

  insert into public.messages (
    conversation_id,
    user_id,
    role,
    content,
    metadata,
    sequence_number,
    client_request_id
  )
  values (
    p_conversation_id,
    v_user_id,
    'user',
    p_content,
    '{}'::jsonb,
    v_next_sequence,
    p_client_request_id
  )
  returning *
  into v_message;

  return v_message;
end;
$$;
create or replace function public.insert_server_message(
  p_conversation_id uuid,
  p_user_id uuid,
  p_role text,
  p_content text,
  p_metadata jsonb
)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_sequence integer;
  v_message public.messages;
begin
  if p_role not in ('assistant', 'system_internal') then
    raise exception 'Invalid server message role';
  end if;

  if not exists (
    select 1
    from public.conversations
    where id = p_conversation_id
      and user_id = p_user_id
  ) then
    raise exception 'Conversation not found';
  end if;

  perform 1
  from public.conversations
  where id = p_conversation_id
  for update;

  select coalesce(max(sequence_number), 0) + 1
  into v_next_sequence
  from public.messages
  where conversation_id = p_conversation_id;

  insert into public.messages (
    conversation_id,
    user_id,
    role,
    content,
    metadata,
    sequence_number
  )
  values (
    p_conversation_id,
    p_user_id,
    p_role,
    p_content,
    coalesce(p_metadata, '{}'::jsonb),
    v_next_sequence
  )
  returning *
  into v_message;

  return v_message;
end;
$$;
create or replace function public.search_user_conversations(
  search_query text
)
returns setof public.conversations
language sql
security invoker
set search_path = public
as $$
  select distinct c.*
  from public.conversations c
  where c.user_id = auth.uid()
    and c.archived_at is null
    and (
      c.title ilike '%' || search_query || '%'
      or exists (
        select 1
        from public.messages m
        where m.conversation_id = c.id
          and m.content ilike '%' || search_query || '%'
      )
    )
  order by c.updated_at desc
  limit 50;
$$;
create or replace function public.consume_rate_limit(
  p_user_id uuid,
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.api_rate_limits;
  v_now timestamptz := now();
begin
  select *
  into v_row
  from public.api_rate_limits
  where user_id = p_user_id
    and bucket = p_bucket
  for update;

  if not found then
    insert into public.api_rate_limits (
      user_id,
      bucket,
      window_start,
      request_count
    )
    values (
      p_user_id,
      p_bucket,
      v_now,
      1
    );

    return true;
  end if;

  if extract(
    epoch from (v_now - v_row.window_start)
  ) >= p_window_seconds then
    update public.api_rate_limits
    set
      window_start = v_now,
      request_count = 1
    where user_id = p_user_id
      and bucket = p_bucket;

    return true;
  end if;

  if v_row.request_count >= p_limit then
    return false;
  end if;

  update public.api_rate_limits
  set request_count = request_count + 1
  where user_id = p_user_id
    and bucket = p_bucket;

  return true;
end;
$$;
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_summaries enable row level security;
alter table public.api_rate_limits enable row level security;
create policy "Users read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
create policy "Users read own conversations"
on public.conversations
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users create own conversations"
on public.conversations
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update own conversations"
on public.conversations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users delete own conversations"
on public.conversations
for delete
to authenticated
using (auth.uid() = user_id);
create policy "Users read messages from own conversations"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
);

create policy "Users update own user messages"
on public.messages
for update
to authenticated
using (
  role = 'user'
  and user_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
)
with check (
  role = 'user'
  and user_id = auth.uid()
);
revoke all
on public.conversation_summaries
from anon, authenticated;

revoke all
on public.api_rate_limits
from anon, authenticated;

revoke insert
on public.messages
from anon, authenticated;
revoke all
on function public.insert_user_message(uuid, text, uuid)
from public;

grant execute
on function public.insert_user_message(uuid, text, uuid)
to authenticated;

revoke all
on function public.insert_server_message(
  uuid,
  uuid,
  text,
  text,
  jsonb
)
from public;

grant execute
on function public.insert_server_message(
  uuid,
  uuid,
  text,
  text,
  jsonb
)
to service_role;

revoke all
on function public.consume_rate_limit(
  uuid,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.consume_rate_limit(
  uuid,
  text,
  integer,
  integer
)
to service_role;

grant execute
on function public.search_user_conversations(text)
to authenticated;
