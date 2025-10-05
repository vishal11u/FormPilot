-- Simple audit table for account deletions and important events
create table if not exists admin_audit (
  id uuid primary key default uuid_generate_v4(),
  event text not null,
  user_id uuid,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);


