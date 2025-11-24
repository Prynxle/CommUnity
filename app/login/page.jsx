import Beams from "../../components/backgrounds/Beams";
import LoginCard from "../../components/auth/LoginCard";

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
        <div className="w-[515px] h-[550px] rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
          <div className="w-full">
            <LoginCard containerless />
          </div>
        </div>
      </div>
    </div>
  );
}
