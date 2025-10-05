import Beams from "../components/Beams";
import LoginCard from "../components/LoginCard";
import logo from "../src/assets/LOGO1.png";

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
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6">
          {/* Header logo + wordmark outside, on top of the container */}
          <div className="relative">
            <img src={logo.src} width={280} height={280} alt="logo" className=" drop-shadow" />
            <span className="tracking-[.90em] text-white/520 text-xl font-bold fontstyle:verdana">COMMUNITY</span>
          </div>

          {/* Ito yung container ng login card */}
          <div className="w-full max-w-3xl min-w-[600px] h-[600px] rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-md shadow-2xl">
            <div className="w-full">
              <LoginCard containerless />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}