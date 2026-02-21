"use client";

import Header from "../../../components/landing/Header.jsx";
import SdgDevFooter from "../../../components/landing/SDGDevFooter.jsx";

export default function SDGPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-orange-900 text-white flex flex-col">

      {/* Navbar only */}
      <Header hideHero={true} />

      <main className="flex-1 px-10 py-24 mt-32">
        <h1 className="text-5xl font-bold mb-12">Sustainable Development Goals</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

          <div>
            <h2 className="text-3xl font-semibold mb-3">SDG 9 – Industry, Innovation, and Infrastructure</h2>
            <p className="text-lg leading-relaxed opacity-90">
              The CommUnity system supports SDG 9 by integrating digital technology into barangay operations.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-3">SDG 11 – Sustainable Cities and Communities</h2>
            <p className="text-lg leading-relaxed opacity-90">
              CommUnity helps create safer, cleaner, and more organized cities.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-3">SDG 16 – Peace, Justice, and Strong Institutions</h2>
            <p className="text-lg leading-relaxed opacity-90">
              CommUnity strengthens trust between locals and barangay officials.
            </p>
          </div>

        </div>
      </main>

      <SdgDevFooter />
    </div>
  );
}
