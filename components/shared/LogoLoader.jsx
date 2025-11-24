"use client";

import Image from "next/image";
import { georama } from "../../lib/fonts";

const LogoLoader = ({ label = "loading" }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-6">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#ff8a00]/30 blur-3xl animate-logo-glow" />
        <Image
          src="/LOGO1.png"
          alt="CommUnity loader"
          width={360}
          height={360}
          priority
          className="relative z-10 drop-shadow-[0_12px_35px_rgba(255,138,0,0.55)] animate-logo-bob"
        />
      </div>
      <p
        className={`${georama.className} text-xs tracking-[0.4em] uppercase text-[#ffb347] animate-pulse`}
      >
        {label}
      </p>
    </div>
  );
};

export default LogoLoader;

