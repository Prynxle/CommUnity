"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { saveUserProfile } from "../../../lib/userStorage";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null;

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    async function run() {
      if (!supabase) {
        setMessage("Supabase is not configured.");
        router.replace("/");
        return;
      }

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        setMessage("Login session not found. Please sign in again.");
        router.replace("/");
        return;
      }

      const profile = {
        firstName: user.user_metadata?.firstName ?? "",
        lastName: user.user_metadata?.lastName ?? "",
        email: user.email ?? "",
      };

      // For OAuth we default to sessionStorage (same pattern as password login).
      saveUserProfile(profile, false);
      router.replace("/home");
    }

    run();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

