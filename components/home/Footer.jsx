"use client";

import Image from "next/image";
import { georama } from "../../lib/fonts";

export default function SdgDevFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-50 bg-white">
      {/* light mode glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* blue glow */}
        <div className="absolute right-[-180px] top-[-160px] h-[460px] w-[460px] rounded-full bg-[#261CC1]/10 blur-[140px]" />
        {/* yellow accent glow */}
        <div className="absolute left-1/2 top-[-200px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.10] blur-[160px]" />
        {/* soft fade to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/85 to-white" />
      </div>

      {/* footer content */}
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-6">

        <p
          className={[
            georama.className,
            "text-[13.5px] sm:text-[14.5px]",
            "text-gray-700",
          ].join(" ")}
        >
          © <span className="font-semibold text-gray-900">2025</span>{" "}
          <span className="font-semibold text-[#1C0770]">0LOPSC-COMMUNITY</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}