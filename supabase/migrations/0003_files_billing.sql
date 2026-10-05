-- Attachments and billing state.
create table public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  original_name text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

alter table public.files enable row level security;

create policy "files_select_own" on public.files
  for select to authenticated
  using (owner_id = auth.uid());

create policy "files_insert_own" on public.files
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy "files_delete_own" on public.files
  for delete to authenticated
  using (owner_id = auth.uid());

create table public.subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  plan text not null,
  provider_event_id text,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated
  using (user_id = auth.uid());

grant select on public.subscriptions to authenticated;
