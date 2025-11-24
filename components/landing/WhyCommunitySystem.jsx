// WhyCommunitySystem.jsx

import { abeezee, assistant } from "../../lib/fonts";
import Image from "next/image";
import reportIcon from "../../src/assets/icons/report.svg";
import trackIcon from "../../src/assets/icons/track.svg";
import aiIcon from "../../src/assets/icons/AI.svg";

const WhyCommunitySystem = () => {
  return (
    <section className="py-24 px-6 bg-black text-white">

      {/* Title */}
      <h2 className={`${abeezee.className} text-center text-4xl font-semibold mb-16`}>
        Why Comm<span className="text-orange-500">Unity</span> System?
      </h2>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-2">


        {/* Card 1 */}
        <div
          className="group bg-[#0F0F0F] rounded-3xl p-10 text-center 
          hover:bg-orange-500 transition duration-300 mx-auto max-w-[330px]
          shadow-[0_12px_30px_rgba(255,255,255,0.18),-8px_0_20px_rgba(255,255,255,0.15),8px_0_20px_rgba(255,255,255,0.15)]"
        >
          <Image
            src={reportIcon}
            alt="Report Icon"
            width={70}
            height={70}
            className="mx-auto mt-6 mb-10 transition duration-300 group-hover:brightness-0"
          />

          <h3
            className={`${assistant.className} text-xl font-semibold mt-8 mb-4
            transition duration-300 group-hover:text-black`}
          >
            Report community issues
          </h3>

          <p
            className={`${abeezee.className} text-[15px] text-gray-300 leading-relaxed
            transition duration-300 group-hover:text-black`}
          >
            This feature lets residents report community issues like broken streetlights or waste problems, helping the barangay respond quickly and keep the area safe and clean.
          </p>
        </div>



        {/* Card 2 */}
        <div
          className="group bg-[#0F0F0F] rounded-3xl p-10 text-center 
          hover:bg-orange-500 transition duration-300 mx-auto max-w-[330px]
          shadow-[0_12px_30px_rgba(255,255,255,0.18),-8px_0_20px_rgba(255,255,255,0.15),8px_0_20px_rgba(255,255,255,0.15)]"
        >
          <Image
            src={trackIcon}
            alt="Track Icon"
            width={70}
            height={70}
            className="mx-auto mt-6 mb-10 transition duration-300 group-hover:brightness-0"
          />

          <h3
            className={`${assistant.className} text-xl font-semibold mt-8 mb-4
            transition duration-300 group-hover:text-black`}
          >
            Track your reports
          </h3>

          <p
            className={`${abeezee.className} text-[15px] text-gray-300 leading-relaxed
            transition duration-300 group-hover:text-black`}
          >
            Users can track the status of their reports in a timeline, ensuring transparency and keeping them updated on progress or resolution.
          </p>
        </div>



        {/* Card 3 */}
        <div
          className="group bg-[#0F0F0F] rounded-3xl p-10 text-center 
          hover:bg-orange-500 transition duration-300 mx-auto max-w-[330px]
          shadow-[0_12px_30px_rgba(255,255,255,0.18),-8px_0_20px_rgba(255,255,255,0.15),8px_0_20px_rgba(255,255,255,0.15)]"
        >
          <Image
            src={aiIcon}
            alt="AI Icon"
            width={60}
            height={60}
            className="mx-auto mt-6 mb-10 transition duration-300 group-hover:brightness-0"
          />

          <h3
            className={`${assistant.className} text-lg font-semibold mt-8 mb-4
            transition duration-300 group-hover:text-black`}
          >
            AI-driven, hassle-free barangay document assistance
          </h3>

          <p
            className={`${abeezee.className} text-[14px] text-gray-300 leading-relaxed
            transition duration-300 group-hover:text-black`}
          >
            This tool guides users on barangay document requirements and processing using AI, reducing manual work and waiting time for a faster, more convenient experience.
          </p>
        </div>


      </div>
    </section>
  );
};

export default WhyCommunitySystem;
