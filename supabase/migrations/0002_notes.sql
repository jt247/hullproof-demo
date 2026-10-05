-- Notes: private notes owned by one user.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index notes_owner_idx on public.notes (owner_id);

grant select, insert, update, delete on public.notes to authenticated;
grant select on public.notes to anon;
