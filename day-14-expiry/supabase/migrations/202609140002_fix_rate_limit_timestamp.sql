create or replace function public.consume_rate_limit(p_bucket_key text, p_limit integer, p_window_seconds integer)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  bucket public.rate_limits%rowtype;
  v_now timestamptz := now();
begin
  if p_limit < 1 or p_limit > 10000 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit';
  end if;

  insert into public.rate_limits(bucket_key, window_started_at, request_count, expires_at)
  values (p_bucket_key, v_now, 0, v_now + make_interval(secs => p_window_seconds))
  on conflict (bucket_key) do nothing;

  select * into bucket from public.rate_limits where bucket_key = p_bucket_key for update;
  if bucket.expires_at <= v_now then
    bucket.window_started_at := v_now;
    bucket.request_count := 0;
    bucket.expires_at := v_now + make_interval(secs => p_window_seconds);
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

revoke execute on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
