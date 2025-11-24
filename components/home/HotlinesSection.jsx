"use client";

import { inter, anek } from "../../lib/fonts"; 
import { FiArrowRight } from "react-icons/fi";

export default function EmergencyResponse() {
  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> {/* ALIGNMENT FIX */}

        {/* Top Label */}
        <p className="text-sm tracking-wide text-[#FBB03B] mb-2">
          INSTANT HELP, ANYTIME
        </p>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Emergency Response
        </h1>

        <p className="text-gray-300 max-w-3xl mb-10">
          Reach critical services in Marikina City in just one tap. Use 161 for
          life-threatening situations or select a local hotline for focused
          assistance.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT BOX */}
          <div className="border border-[#2B2B2B] bg-[#121212] rounded-2xl p-8 shadow-xl">
            <h2 className="text-[#FF8A00] text-2xl font-bold">CALL 161</h2>

            <div className="flex items-center gap-2 mt-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#2A2A2A] text-xs text-orange-400 tracking-wide">
                EMERGENCY • 161
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed">
              For any situation where life, health, or safety is in immediate
              danger, call the national emergency hotline.
            </p>

            {/* CALL 161 BUTTON */}
            <a
              href="tel:161"
              className="
                block text-center mt-6 bg-gradient-to-r from-[#FF8A00] to-[#ff9f2e]
                text-black font-semibold py-3 rounded-lg shadow-[0_0_20px_#ff8a0035]
                hover:opacity-90 transition
              "
            >
              CALL 161 NOW →
            </a>

            <div className="h-px bg-[#2B2B2B] my-6" />

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-xs text-red-400 tracking-wide">
                ONLY FOR REAL EMERGENCIES
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              For non-urgent concerns and follow-up on reports, use the barangay
              or city hotlines listed on the right.
            </p>
          </div>

          {/* RIGHT BOX */}
          <div className="border border-[#2B2B2B] bg-[#121212] rounded-2xl p-8 shadow-xl">
            <h2 className="text-gray-300 tracking-[.15em] mb-4 text-sm">
              MARIKINA CITY HOTLINES
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Save these contacts to your phone so you can reach help even when
              you're offline.
            </p>

            {/* Scroll Area */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent">

              {hotlines.map(({ office, desc, num1, num2, tel }) => (
                <div
                  key={office}
                  className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{office}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                    <p className="text-sm text-gray-300 mt-1 leading-tight">
                      {num1}
                      <br />
                      {num2 && num2}
                    </p>
                  </div>

                  <a
                    href={`tel:${tel}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A2A2A] text-sm hover:bg-white hover:text-black transition"
                  >
                    CALL <FiArrowRight size={14} />
                  </a>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* Hotline Data */
const hotlines = [
  {
    office: "Marikina City DRRMO",
    desc: "Disaster Risk Reduction & Management Office",
    num1: "(02) 1234-1111",
    num2: "Main hotline",
    tel: "0212341111",
  },
  {
    office: "Marikina Rescue",
    desc: "City-wide rescue & ambulance response",
    num1: "(02) 1234-2222",
    num2: "(02) 1234-2222",
    tel: "0212342222",
  },
  {
    office: "Marikina Police",
    desc: "City Police Station",
    num1: "(02) 1234-3333",
    num2: "Desk & patrol",
    tel: "0212343333",
  },
  {
    office: "Bureau of Fire Protection – Marikina",
    desc: "Fire Station",
    num1: "(02) 1234-4444",
    tel: "0212344444",
  },
  {
    office: "Marikina Health Office",
    desc: "Public health & ambulance coordination",
    num1: "(02) 1234-5555",
    num2: "Clinic hours & referrals",
    tel: "0212345555",
  },
];
