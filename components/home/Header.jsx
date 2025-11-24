"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { georama, poppins } from "../../lib/fonts";
import { clearUserProfile, getUserProfile, STORAGE_KEY } from "../../lib/userStorage";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const menuRef = useRef(null);
  const router = useRouter();
  const greetingName =
    profile.firstName?.trim() ||
    profile.lastName?.trim() ||
    (profile.email ? profile.email.split("@")[0] : "User");
  const emailLabel = profile.email || "user@example.com";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadProfile = () => {
      const stored = getUserProfile();
      if (stored) {
        setProfile({
          firstName: stored.firstName ?? "",
          lastName: stored.lastName ?? "",
          email: stored.email ?? "",
        });
      } else {
        setProfile({ firstName: "", lastName: "", email: "" });
      }
    };

    loadProfile();

    const handleStorage = (event) => {
      if (!event.key || event.key === STORAGE_KEY) {
        loadProfile();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    clearUserProfile();
    setProfile({ firstName: "", lastName: "", email: "" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#1E1E1E] bg-black/90 backdrop-blur">
      {/* Full-width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Flex container that pushes left + right */}
        <div className="flex items-center justify-between py-3 h-[80px]">

          {/* Logo + Text */}
          <div className="flex items-center">
            <img
              src="/LOGO1.png"
              alt="CommUnity Logo"
              className="h-[60px] sm:h-[80px] md:h-[110px] w-auto object-contain"
            />
            <span
              className={`${georama.className} font-extrabold text-white text-[22px] sm:text-[26px] md:text-[24px] tracking-[0.25em] -ml-[50px]`}
            >
              COMM<span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* RIGHT SIDE — Navigation */}
          <div className="flex items-center gap-10">
            <nav
              className={`${poppins.className} hidden md:flex items-center gap-12 text-sm`}
            >
              <a href="#actions" className="hover:text-[#FF8A00]">Actions</a>
              <a href="#track" className="hover:text-[#FF8A00]">Track</a>
              {/* Updates removed here */}
              <a href="#dashboard" className="hover:text-[#FF8A00]">Dashboard</a>
              <a href="#hotlines" className="hover:text-[#FF8A00]">Hotlines</a>

              <a
                href="#submit-report"
                className="rounded-md bg-[#FF8A00] px-3 py-2 text-xs font-semibold text-black hover:bg-[#ff9f2e] transition"
              >
                Report Now
              </a>
            </nav>

            {/* User */}
            <div className="flex items-center gap-2 text-sm relative" ref={menuRef}>
              <span className="hidden sm:inline">Hi, {greetingName}!</span>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF8A00] bg-black/60 text-white hover:bg-black transition"
              >
                <span className="text-xs">👤</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-white/10 bg-[#111111]/95 p-3 shadow-2xl backdrop-blur">
                  <p className="text-xs text-white/60 mb-2">Signed in as</p>
                  <p className="text-sm font-semibold text-white mb-3">{emailLabel}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-[#FF8A00] py-2 text-xs font-semibold text-black hover:bg-[#ffa640] transition"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
