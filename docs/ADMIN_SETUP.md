# Admin portal setup

The admin interface uses **Supabase Auth**. Create two users in your project so CSA Admin and Clinic Admin can sign in.

---

## 1. Create admin users in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Users** → **Add user** → **Create new user**.

If your project requires **Confirm email**, either turn it off for testing (Authentication → Providers → Email → “Confirm email” off) or after creating each user go to **Users** → click the user → **Confirm email** so they can sign in.

Create **two** users with these exact emails and passwords:

| Email                     | Password  | Role         |
|---------------------------|-----------|--------------|
| `csa_admin@community.local`  | `csa2026`  | CSA Admin    |
| `clinic_admin@community.local` | `clinic2026` | Clinic Admin |

- **Email**: Copy exactly (e.g. `csa_admin@community.local`).
- **Password**: Set the password (e.g. `csa2026`). You can uncheck “Auto-generate password” and type it.

Repeat for the second user.

---

## 2. Sign in to the admin portal

1. In your app, go to **`/admin/login`**.
2. **Admin account**: Choose “CSA Admin” or “Clinic Admin”.
3. **Password**: Enter `csa2026` or `clinic2026` for the chosen account.
4. Click **Sign in**. You’ll be redirected to **`/admin`** (report dashboard).

---

## 3. What each admin sees

- **CSA Admin** (`csa_admin`): Reports where category is Student Welfare, Harassment, or Peer Conflict.
- **Clinic Admin** (`clinic_admin`): Reports where category is Trauma, Medical Treatment, or Others.

Each admin can only list and update status for reports assigned to their role.

---

## 4. Changing passwords later

In Supabase: **Authentication** → **Users** → select the user → **Send password recovery** (or use the Supabase Auth APIs to update the password).
