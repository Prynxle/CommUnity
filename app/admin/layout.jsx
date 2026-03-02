"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminSession, clearAdminSession } from "../../lib/adminStorage";
import { poppins } from "../../lib/fonts";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const session = getAdminSession();
    if (isLoginPage) {
      if (session?.role && session?.access_token) {
        router.replace("/admin");
        return;
      }
      setAdmin(null);
      setChecking(false);
      return;
    }
    if (!session?.role || !session?.access_token) {
      router.replace("/admin/login");
      return;
    }
    setAdmin(session);
    setChecking(false);
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C0770]">
        <div className="text-white/90">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminHeader admin={admin} />
      <main className="mx-auto w-full max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}

function AdminHeader({ admin }) {
  const router = useRouter();

  function handleLogout() {
    clearAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  const roleLabel =
    admin?.role === "csa_admin"
      ? "CSA Admin"
      : admin?.role === "clinic_admin"
        ? "Clinic Admin"
        : "Admin";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1C0770] shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className={`${poppins.className} flex items-center gap-2 text-lg font-semibold text-white`}
        >
          <span className="rounded bg-white/15 px-2 py-0.5 text-sm">Admin</span>
          Report Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80">{roleLabel}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
