import Beams from "../../components/Beams";
import RegistrationCard from "../../components/RegistrationCard";
import logo from "../../src/assets/LOGO1.png";

export default function RegisterPage() {
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
                {/* Header logo + wordmark outside, on top of the container */}
                <div className="relative flex flex-col items-center text-center -mt-25">
                  <img src={logo.src} width={300} height={300} alt="logo" className="drop-shadow mt-12" />
                  <span className="relative -top-4 tracking-[.35em] text-3xl font-bold font-georama mt-[-8px]">
                    <span className="text-white">COMM</span>
                    <span className="text-orange-500">UNITY</span>
                  </span>
      
                </div>

          {/* Registration container */}
          <div className="w-[600px] h-[800px] rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
            <div className="w-full">
              <RegistrationCard containerless />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
