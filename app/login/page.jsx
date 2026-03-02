import Beams from "../../components/backgrounds/Beams";
import LoginCard from "../../components/auth/LoginCard";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full">
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

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto px-4 py-6 sm:py-8">
        <div className="flex w-full max-w-[515px] flex-col items-center gap-4 sm:gap-6">
          {/* LOGO + TITLE */}
          <div className="flex flex-col items-center text-center">
            <Link href="/landingpage" aria-label="Go to landing page">
              <Image
                src="/LOGO1.png"
                width={180}
                height={180}
                alt="CommUnity Logo"
                className="drop-shadow h-[72px] w-[72px] sm:h-24 sm:w-24 md:h-[140px] md:w-[140px] object-contain"
              />
            </Link>

            <span className="relative -top-2 sm:-top-4 tracking-[.2em] sm:tracking-[.35em] text-2xl sm:text-3xl font-bold font-georama">
              <span className="text-white">COMM</span>
              <span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* Login container */}
          <div className="w-full max-w-[515px] min-h-[420px] rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="w-full">
              <LoginCard containerless />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
