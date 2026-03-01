# Supabase schema: Rule-Based Multi-Stage Report Processing

Run this in the Supabase **SQL Editor** to create the `reports` and `report_timeline_log` tables used by the algorithm.

---

## 1. Reports table

Stores each submission with status, priority, and assignment (Phases 1–4).

```sql
-- Reports table (multi-stage processing)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_id text not null unique,
  category text not null,
  location_category text not null,
  sub_location text,
  description text not null,
  first_name text not null,
  email text not null,
  photo_url text,
  status text not null default 'SUBMITTED' check (status in ('SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  priority text not null default 'NORMAL' check (priority in ('CRITICAL', 'HIGH', 'NORMAL')),
  priority_score int not null default 0,
  assigned_to text not null check (assigned_to in ('csa_admin', 'clinic_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reports_status on public.reports (status);
create index if not exists idx_reports_assigned_to on public.reports (assigned_to);
create index if not exists idx_reports_created_at on public.reports (created_at desc);

alter table public.reports enable row level security;

-- Allow anon to insert (public form). Read/update/delete use service role (bypasses RLS) in your API.
create policy "Allow insert reports"
  on public.reports for insert with check (true);
```

If you prefer to keep RLS strict and only use the service role key (no anon insert), you can skip the insert policy and rely on the service role bypassing RLS.

---

## 2. Report timeline log (Phase 5)

Logs every status change for auditing and notifications.

```sql
create table if not exists public.report_timeline_log (
  id uuid primary key default gen_random_uuid(),
  report_id text not null references public.reports(report_id) on delete cascade,
  previous_status text not null,
  new_status text not null,
  changed_at timestamptz not null default now(),
  admin_id text
);

create index if not exists idx_report_timeline_log_report_id on public.report_timeline_log (report_id);

alter table public.report_timeline_log enable row level security;

-- Timeline is written/read only by your API (service role bypasses RLS). No anon policy needed.
```

---

## 3. Optional: trigger to update `updated_at` on reports

```sql
create or replace function public.set_reports_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at
  before update on public.reports
  for each row execute function public.set_reports_updated_at();
```

---

## 4. Run order

1. Run the `reports` table block (create table + indexes + RLS/policies).
2. Run the `report_timeline_log` table block.
3. Run the `updated_at` trigger block if you want automatic `updated_at` updates.

After this, the Next.js API will use the `reports` and `report_timeline_log` tables for the multi-stage algorithm.
