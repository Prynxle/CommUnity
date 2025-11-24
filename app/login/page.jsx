import Beams from "../../components/backgrounds/Beams";
import LoginCard from "../../components/auth/LoginCard";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
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
          
          {/* LOGO + TITLE */}
          <div className="relative flex flex-col items-center text-center -mt-25">
            <Link href="/landingpage" aria-label="Go to landing page">
              <Image
                src="/LOGO1.png"     // <-- FIXED
                width={300}
                height={300}
                alt="CommUnity Logo"
                className="drop-shadow mt-12"
              />
            </Link>

            <span className="relative -top-4 tracking-[.35em] text-3xl font-bold font-georama mt-[-8px]">
              <span className="text-white">COMM</span>
              <span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* Registration container */}
          <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <div className="w-[515px] h-[550px] rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
          <div className="w-full">
              <LoginCard containerless />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
