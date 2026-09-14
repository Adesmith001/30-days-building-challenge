create extension if not exists pgcrypto;

create table public.secrets (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  ciphertext text,
  iv text,
  expires_at timestamptz,
  expiry_type text not null check (expiry_type in ('after_opening', 'time')),
  max_views integer check (max_views is null or max_views > 0),
  view_count integer not null default 0 check (view_count >= 0),
  status text not null default 'active' check (status in ('active', 'consumed', 'expired', 'destroyed')),
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.history (
  id uuid primary key default gen_random_uuid(),
  secret_id text not null unique references public.secrets(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  expiry_type text not null check (expiry_type in ('after_opening', 'time')),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'consumed', 'expired', 'destroyed')),
  view_count integer not null default 0 check (view_count >= 0),
  max_views integer,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  bucket_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  expires_at timestamptz not null
);

create index history_owner_created_idx on public.history(owner_id, created_at desc);
create index rate_limits_expiry_idx on public.rate_limits(expires_at);

alter table public.secrets enable row level security;
alter table public.history enable row level security;
alter table public.rate_limits enable row level security;

revoke all on public.secrets from anon, authenticated;
revoke all on public.rate_limits from anon, authenticated;
revoke all on public.history from anon;
grant select, delete on public.history to authenticated;

create policy "Creators read their own history"
  on public.history for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Creators delete their own history"
  on public.history for delete to authenticated
  using ((select auth.uid()) = owner_id);

create or replace function public.reveal_secret(p_secret_id text)
returns table (ciphertext text, iv text, expires_at timestamptz, expiry_type text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret_row public.secrets%rowtype;
  revealed_ciphertext text;
  revealed_iv text;
begin
  select * into secret_row from public.secrets where id = p_secret_id for update;
  if not found or secret_row.status <> 'active' or secret_row.ciphertext is null then return; end if;

  if secret_row.expires_at is not null and secret_row.expires_at <= now() then
    update public.secrets set status = 'expired', ciphertext = null, iv = null where id = p_secret_id;
    update public.history set status = 'expired' where secret_id = p_secret_id;
    return;
  end if;

  revealed_ciphertext := secret_row.ciphertext;
  revealed_iv := secret_row.iv;

  if secret_row.expiry_type = 'after_opening' then
    update public.secrets set status = 'consumed', view_count = view_count + 1,
      consumed_at = now(), ciphertext = null, iv = null where id = p_secret_id;
    update public.history set status = 'consumed', view_count = view_count + 1,
      consumed_at = now() where secret_id = p_secret_id;
  else
    update public.secrets set view_count = view_count + 1 where id = p_secret_id;
    update public.history set view_count = view_count + 1 where secret_id = p_secret_id;
  end if;

  return query select revealed_ciphertext, revealed_iv, secret_row.expires_at, secret_row.expiry_type;
end;
$$;

create or replace function public.consume_rate_limit(p_bucket_key text, p_limit integer, p_window_seconds integer)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  bucket public.rate_limits%rowtype;
  current_time timestamptz := now();
begin
  if p_limit < 1 or p_limit > 10000 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit';
  end if;

  insert into public.rate_limits(bucket_key, window_started_at, request_count, expires_at)
  values (p_bucket_key, current_time, 0, current_time + make_interval(secs => p_window_seconds))
  on conflict (bucket_key) do nothing;

  select * into bucket from public.rate_limits where bucket_key = p_bucket_key for update;
  if bucket.expires_at <= current_time then
    bucket.window_started_at := current_time;
    bucket.request_count := 0;
    bucket.expires_at := current_time + make_interval(secs => p_window_seconds);
  end if;

  if bucket.request_count >= p_limit then
    return query select false, 0, bucket.expires_at;
    return;
  end if;

  bucket.request_count := bucket.request_count + 1;
  update public.rate_limits set window_started_at = bucket.window_started_at,
    request_count = bucket.request_count, expires_at = bucket.expires_at
    where bucket_key = p_bucket_key;
  return query select true, p_limit - bucket.request_count, bucket.expires_at;
end;
$$;

create or replace function public.expire_secrets()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer;
begin
  update public.secrets set status = 'expired', ciphertext = null, iv = null
    where status = 'active' and expires_at is not null and expires_at <= now();
  get diagnostics affected = row_count;
  update public.history set status = 'expired'
    where status = 'active' and expires_at is not null and expires_at <= now();
  delete from public.rate_limits where expires_at < now() - interval '1 day';
  return affected;
end;
$$;

revoke execute on function public.reveal_secret(text) from public, anon, authenticated;
revoke execute on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke execute on function public.expire_secrets() from public, anon, authenticated;
grant execute on function public.reveal_secret(text) to service_role;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
grant execute on function public.expire_secrets() to service_role;
