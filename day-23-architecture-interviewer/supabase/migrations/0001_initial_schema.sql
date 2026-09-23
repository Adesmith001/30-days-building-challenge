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
  interview_state jsonb not null default jsonb_build_object(
    'stage', 'understand',
    'functionalRequirements', '[]'::jsonb,
    'nonFunctionalRequirements', '[]'::jsonb,
    'assumptions', '[]'::jsonb,
    'decisions', '[]'::jsonb,
    'unresolvedQuestions', '[]'::jsonb,
    'risks', '[]'::jsonb,
    'constraints', '[]'::jsonb,
    'scale', '{}'::jsonb,
    'discussedTopics', '[]'::jsonb
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (
    role in ('user', 'assistant', 'system_internal')
  ),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  sequence_number integer not null,
  client_request_id uuid,
  created_at timestamptz not null default now(),

  constraint messages_conversation_sequence_unique
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
  user_id uuid not null references auth.users(id) on delete cascade,
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

create index messages_content_search_idx
  on public.messages
  using gin(to_tsvector('english', content));

create unique index messages_client_request_unique_idx
  on public.messages(user_id, client_request_id)
  where client_request_id is not null;

create index rate_limits_window_idx
  on public.api_rate_limits(window_start);

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
for each row
execute function public.set_updated_at();

create trigger conversations_set_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

create trigger summaries_set_updated_at
before update on public.conversation_summaries
for each row
execute function public.set_updated_at();

create trigger rate_limits_set_updated_at
before update on public.api_rate_limits
for each row
execute function public.set_updated_at();

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
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_summaries enable row level security;
alter table public.api_rate_limits enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- conversation policies
create policy "Users can read own conversations"
on public.conversations
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create own conversations"
on public.conversations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own conversations"
on public.conversations
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own conversations"
on public.conversations
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read messages in own conversations"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "Users can insert messages in own conversations"
on public.messages
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "Users can update messages in own conversations"
on public.messages
for update
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = (select auth.uid())
  )
)
with check (
  user_id = (select auth.uid())
);

create policy "Users can delete messages in own conversations"
on public.messages
for delete
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "Users can read own conversation summaries"
on public.conversation_summaries
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_summaries.conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "Users can create own conversation summaries"
on public.conversation_summaries
for insert
to authenticated
with check (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_summaries.conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "Users can update own conversation summaries"
on public.conversation_summaries
for update
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_summaries.conversation_id
      and c.user_id = (select auth.uid())
  )
);

revoke all
on public.api_rate_limits
from anon, authenticated;