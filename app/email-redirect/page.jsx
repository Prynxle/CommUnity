// app/email-redirect/page.jsx — Post-registration “check your email” screen
import Link from "next/link";
import Beams from "../../components/backgrounds/Beams";
import EmailRedirect from "../../components/auth/emailRedirect";

export default function EmailRedirectPage() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 -z-10">
        <Beams
          beamWidth={3}
          beamHeight={50}
          beamNumber={30}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex flex-col items-center text-center -mt-10">
            {/* Logo - removed link to prevent accidental navigation */}
            <img
              src="/LOGO1.png"
              width={300}
              height={300}
              alt="logo"
              className="drop-shadow"
            />

            <span className="relative -top-2 tracking-[.35em] text-3xl font-bold font-georama mt-[-8px]">
              <span className="text-white">COMM</span>
              <span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* Email redirect container (same shell as login card) */}
          <div className="w-[515px] h-[320px] rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl flex items-center">
            <div className="w-full">
              <EmailRedirect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
