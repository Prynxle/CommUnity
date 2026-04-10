"use client";

import Image from "next/image";
import { georama } from "../../lib/fonts";

const LogoLoader = ({ label = "loading" }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-6">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#2624BF]/30 blur-3xl animate-logo-glow" /> 
        <Image
          src="/olopsclogo.png"
          alt="CommUnity loader"
          width={720}
          height={720}
          priority
          className="relative z-10 drop-shadow-[0_12px_35px_rgba(14, 14, 232)] animate-logo-bob"
        />
      </div>
      <p
        className={`${georama.className} text-xs tracking-[0.4em] uppercase text-[#F5E905] animate-pulse`} // TEXT COLOR LOADING
      >
        {label}
      </p>
    </div>
  );
};
// COLOR CODE

// BLUE - 2624BF
// YELLOW - F5E905
// WHITE - FFFFFF
export default LogoLoader;

