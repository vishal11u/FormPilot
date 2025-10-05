-- Re-enable RLS and set minimal secure policies for FormPilot
-- Run this in the Supabase SQL editor for your project

-- FORMS TABLE POLICIES (users manage only their own forms)
alter table if exists forms enable row level security;

drop policy if exists "forms_select_own" on forms;
drop policy if exists "forms_insert_own" on forms;
drop policy if exists "forms_update_own" on forms;
drop policy if exists "forms_delete_own" on forms;

create policy "forms_select_own" on forms
for select to authenticated
using (user_id = auth.uid());

create policy "forms_insert_own" on forms
for insert to authenticated
with check (user_id = auth.uid());

create policy "forms_update_own" on forms
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "forms_delete_own" on forms
for delete to authenticated
using (user_id = auth.uid());


-- SUBMISSIONS TABLE POLICIES
alter table if exists submissions enable row level security;

-- If you use the service-role key (server-side) for inserts via API,
-- you do NOT need a public insert policy. The admin client bypasses RLS.
-- Remove the public insert policy below unless you explicitly want it.

-- Optional: allow public (anon) inserts if not using admin client
-- drop policy if exists "submissions_public_insert_by_form_id" on submissions;
-- create policy "submissions_public_insert_by_form_id" on submissions
-- for insert to anon
-- with check (exists (
--   select 1 from forms f where f.form_id = submissions.form_id
-- ));

drop policy if exists "submissions_select_owner_forms" on submissions;
create policy "submissions_select_owner_forms" on submissions
for select to authenticated
using (
  exists (
    select 1 from forms f
    where f.form_id = submissions.form_id
      and f.user_id = auth.uid()
  )
);

-- Optional maintenance: index for faster lookups by form_id
-- create index if not exists submissions_form_id_idx on submissions(form_id);
-- create index if not exists forms_form_id_idx on forms(form_id);


