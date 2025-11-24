// MV.jsx

import Image from "next/image";
import { assistant, abeezee } from "../../lib/fonts";

import visionIcon from "../../src/assets/icons/vision.svg";
import missionIcon from "../../src/assets/icons/mission.svg";
import containerBg from "../../src/assets/icons/container.png";

const MV = () => {
  return (
    <section className="w-full py-24 px-6 md:px-10 bg-black text-white">

      {/* OUTER WRAPPER WITH SOFT ORANGE SHADOW */}
      <div
        className="
          mx-auto
          max-w-[1200px]
          rounded-3xl
          overflow-hidden
          0 40px 80px rgba(0,0,0,0.25),0px_0px_50px_rgba(255,140,20,0.20)]
        "
      >

        {/* INNER ORANGE BACKGROUND */}
        <div
          className="
            rounded-3xl
            overflow-hidden
            bg-cover bg-center
            p-16
            relative
          "
          style={{ backgroundImage: `url(${containerBg.src})`, filter: 'brightness(0.8)'}}
        >

          {/* DIVIDER – DESKTOP */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[4px] h-80 bg-white opacity-100 rounded-full"></div>
          </div>

          {/* DIVIDER – MOBILE */}
          <div className="md:hidden flex justify-center my-6">
            <div className="w-40 h-[4px] bg-white opacity-100 rounded-full"></div>
          </div>


          {/* CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center">

            {/* Vision */}
            <div className="flex flex-col items-center">
              <Image src={visionIcon} width={80} height={80} alt="Vision Icon" className="mb-6" />
              <h3 className={`${assistant.className} text-3xl font-bold mb-4`}>Our Vision</h3>
              <p className={`${abeezee.className} text-[17px] text-black leading-relaxed max-w-[420px]`}>
                To build a technology-driven, responsive community in Marikina Heights where
                barangay authorities and residents collaborate efficiently through open
                communication, ensuring all concerns are acknowledged and addressed promptly.
              </p>
            </div>

            {/* Mission */}
            <div className="flex flex-col items-center">
              <Image src={missionIcon} width={80} height={80} alt="Mission Icon" className="mb-6" />
              <h3 className={`${assistant.className} text-3xl font-bold mb-4`}>Our Mission</h3>
              <p className={`${abeezee.className} text-[17px] text-black leading-relaxed max-w-[420px]`}>
                This project aims to design and implement a user-friendly digital platform
                for Marikina Heights residents to report local issues, track their requests,
                encourage civic engagement, while enhancing efficiency, accountability,
                and transparency.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MV;
