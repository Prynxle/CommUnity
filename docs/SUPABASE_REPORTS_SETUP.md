# Supabase setup for Incident Reports

Do these steps **once** in your [Supabase Dashboard](https://supabase.com/dashboard) so the "Submit a Report" form can save data.

---

## 1. Create the table

In Supabase: **Table Editor** → **New table**.

- **Name:** `incident_reports`
- **Options:** Enable "Enable Row Level Security (RLS)" (we'll add a policy so anyone can insert).

Then add these columns (you can use **SQL Editor** instead if you prefer one shot):

| Column name     | Type         | Nullable | Default           |
|----------------|--------------|----------|-------------------|
| id             | uuid         | No       | `gen_random_uuid()`|
| first_name     | text         | Yes      | —                 |
| last_name      | text         | Yes      | —                 |
| email          | text         | No       | —                 |
| mobile_number  | text         | Yes      | —                 |
| street         | text         | No       | —                 |
| issue_type     | text         | No       | —                 |
| description    | text         | Yes      | —                 |
| photo_url      | text         | Yes      | —                 |
| created_at     | timestamptz  | No       | `now()`           |

**One-shot SQL (Table Editor → New query):**

```sql
create table public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  mobile_number text,
  street text not null,
  issue_type text not null,
  description text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Allow anyone (anon) to insert a new report (for the public form)
alter table public.incident_reports enable row level security;

-- If you get "policy already exists", run only the line below first, then the create:
-- drop policy if exists "Anyone can insert incident reports" on public.incident_reports;
create policy "Anyone can insert incident reports"
  on public.incident_reports
  for insert
  to anon
  with check (true);

-- Optional: only allow authenticated users or service role to read/update/delete
-- For now we don't add SELECT/UPDATE/DELETE for anon so the app uses the API with your key.
```

Run the query. After that, the table exists and the form can insert rows via your Next.js API (using the service/anon key on the server).

---

## 2. (Optional) Storage for photos

If you want to store attached photos:

1. **Storage** → **New bucket**.
2. Name: `report-photos` (or any name).
3. **Public bucket:** On if you want direct image URLs; Off if you’ll serve via signed URLs.
4. **Create bucket.**

Then add a policy so uploads are allowed (e.g. from your app via API using anon key). For a simple public bucket that accepts uploads:

- **Storage** → your bucket → **Policies** → **New policy**.
- Choose “For full customization” and add a policy that allows `INSERT` for role `anon` (and optionally `SELECT` for `anon` if the bucket is public).

Example policy (allow insert for anon):

```sql
-- In Storage → report-photos → Policies
-- Policy: "Allow public uploads"
-- Allowed operation: INSERT
-- Target roles: anon (and authenticated if you want logged-in users only)
```

After this, your API can upload files to this bucket and save the returned path/URL in `incident_reports.photo_url`.

---

## 3. Use the service role key for reports (recommended)

The reports API runs on your server and should use the **service role** key so inserts are not blocked by RLS.

1. In Supabase: **Settings** → **API**.
2. Under "Project API keys", copy **service_role** (the secret one, not anon).
3. In your project root, add to `.env.local`:

   ```
   SUPABASE_SERVICE_ROLE_KEY=paste_the_service_role_key_here
   ```

4. Restart the dev server so it picks up the new env var.

The service role key bypasses Row Level Security, so your API can insert into `incident_reports` without adding an RLS policy. **Keep this key secret** – use it only in server-side code (e.g. API routes), never in the browser.

If you don’t set `SUPABASE_SERVICE_ROLE_KEY`, the app falls back to `SUPABASE_ANON_KEY` and you must have an RLS policy that allows anon to insert.

---

## 4. Verify

After the table and (optional) bucket exist:

1. Run the app and open the Submit a Report section.
2. Fill the form and submit.
3. In Supabase **Table Editor** → **incident_reports**, you should see the new row.

If something fails, check the browser Network tab for the `/api/reports` request and the Next.js server logs for errors.
