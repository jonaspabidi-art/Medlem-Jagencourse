-- JAgencourse medlemsområde: schema, RLS, trigger.
-- Kör i Supabase Studio SQL Editor (eller via Supabase CLI).

-- ============================================================
-- APPLICATIONS: publika ansökningar från landningssidans formulär
-- ============================================================
create table applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null unique,
  phone         text,
  weekly_hours  text,
  goal          text,
  status        text not null default 'pending',
  approved_at   timestamptz,
  approved_by   uuid references auth.users(id)
);

alter table applications enable row level security;

-- Publikt lead-formulär: vem som helst kan skapa en ansökan, ingen kan läsa dem.
create policy "anon and authenticated can insert applications"
  on applications for insert
  to anon, authenticated
  with check (true);

create policy "admins can select applications"
  on applications for select
  to authenticated
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );

create policy "admins can update applications"
  on applications for update
  to authenticated
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );

-- ============================================================
-- PROFILES: 1:1 med auth.users, håller admin-flaggan
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can select own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "admins can select all profiles"
  on profiles for select
  to authenticated
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Ingen insert/update-policy för authenticated: profilraden hanteras uteslutande
-- av triggern nedan (skapande) och service-role (godkännande). Detta stänger
-- av client-side-uppdatering av is_admin (mass-assignment-footgun).

-- ============================================================
-- MODULES / LESSONS: kursinnehåll, öppet för alla inloggade
-- ============================================================
create table modules (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table modules enable row level security;

create policy "authenticated can select modules"
  on modules for select
  to authenticated
  using (true);

create table lessons (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references modules(id) on delete cascade,
  title        text not null,
  description  text,
  video_path   text not null,
  duration_sec int,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

alter table lessons enable row level security;

create policy "authenticated can select lessons"
  on lessons for select
  to authenticated
  using (true);

-- Ingen insert/update/delete-policy för authenticated: innehåll hanteras via
-- service-role / Supabase Studio i v1.

-- ============================================================
-- LESSON_PROGRESS: bockar + progress-ringar per elev
-- ============================================================
create table lesson_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table lesson_progress enable row level security;

create policy "users can select own progress"
  on lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own progress"
  on lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can delete own progress"
  on lesson_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: skapa profiles-rad automatiskt när en auth-user skapas
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- STORAGE: privat bucket för lektionsvideor
-- ============================================================
insert into storage.buckets (id, name, public)
values ('lesson-videos', 'lesson-videos', false)
on conflict (id) do nothing;

-- Inga RLS-policyer för authenticated på storage.objects i denna bucket.
-- Bucketen är helt privat — endast service-role (via signed URLs i
-- app/api/lessons/[id]/video-url) kommer åt innehållet.

-- ============================================================
-- KRITISKT (görs INTE via SQL): stäng av publik registrering i
-- Supabase Studio → Authentication → Settings → "Allow new users to sign up" = OFF.
-- Utan detta kringgås hela godkännandegaten.
-- ============================================================
