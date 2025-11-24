"use client";

import Image from "next/image";
import { albertSans, inter, alatsi, georama, abeezee } from "../../lib/fonts";

export default function DidYouKnow() {
  return (
    <>
      {/* Main Content Section */}
      <section className="min-h-[900px] md:min-h-[900px] bg-black text-white flex flex-col items-center justify-center px-6 py-16 pt-0">
        {/* Tagline */}
        <div className="text-center mb-6 -mt-10">
          <span className="inline-block bg-[#0F0F0F] text-[#ff8a00] text-sm px-8 py-3 rounded-full tracking-[0.30em]">
            CONNECT. REPORT. RESOLVE.
          </span>
        </div>

        {/* Main Title */}
        <h1 className={`${albertSans.className} text-2xl sm:text-3xl md:text-4xl text-center mb-3 leading-tight`}>
          Welcome to Marikina Heights <br />
          Comm<span className="text-[#ff8a00]">Unity</span> System!
        </h1>

        {/* Subtitle */}
        <p className={`${inter.className} text-gray-300 max-w-2xl text-center mb-12 text-base md:text-lg leading-8 md:leading-9 tracking-wide`}>
          The CommUnity System provides a convenient platform for residents to <br />
          report concerns and connect with barangay officials quickly and <br />
          efficiently.
        </p>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className={`${alatsi.className} text-3xl sm:text-4xl md:text-[40px] font-semibold mb-6 -mt-20`}>
              Marikina Heights
            </h2>
            <p className={`${inter.className} text-gray-300 text-base md:text-lg leading-7 md:leading-9`}>
              Marikina Heights is a residential barangay in <br />
              Marikina City, Metro Manila, located in the <br />
              elevated eastern part near the Sierra Madre <br />
              foothills, known for its schools, subdivisions, <br />
              and relatively low flood risk.
            </p>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <Image
              src="/MarHeights.jpg"
              alt="Marikina Heights Barangay Hall"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg"
            />

          </div>
        </div>
      </section>


      {/* Did You Know Section */}
      <section
        className="bg-cover bg-center py-20 flex items-center justify-center"
        style={{
          backgroundImage: 'url("/orange.png")', // Background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '380px', // Ensure a minimum height for the section
        }}
      >
        <div className="text-center mt-16">   {/* ⬅️ added mt-8 */}
          <h3
            className={`${georama.className} text-[28px] font-bold mb-4 text-white tracking-[0.15em]`}
          >
            DID YOU KNOW?
          </h3>

          <p
            className={`${abeezee.className} text-[20px] text-gray-200 max-w-3xl mx-auto leading-10 text-center`}
          >
            Marikina Heights, formerly Concepcion, is a barangay in the city of Marikina. Its population
            as determined by the 2020 Census was 42,761. This represented 9.38% of the total
            population of Marikina. (PhilAtlas, n.d.)
          </p>

        </div>


      </section>
    </>
  );
}
