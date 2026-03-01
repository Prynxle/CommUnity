"use client";

import Header from "../../components/landing/Header.jsx";
import Footer from "../../components/landing/Footer.jsx";
import Image from "next/image";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-orange-900 text-white flex flex-col">

      {/* Navbar only */}
      <Header hideHero={true} />

      {/* PAGE CONTENT */}
      <main className="flex-1 px-6 sm:px-12 md:px-20 py-24 mt-32">
        <h1 className="text-5xl font-bold text-center mb-16">Developers</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 text-center">

          {/* Developer 1 */}
          <div className="flex flex-col items-center">
            <Image
              src="/dev.png"   // replace this with your actual icon
              alt="Developer Icon"
              width={150}
              height={150}
              className="mb-6 opacity-90"
            />
            <h2 className="text-xl font-bold tracking-wide">
              ANNE TRIXIE <br /> URBANO
            </h2>
          </div>

          {/* Developer 2 */}
          <div className="flex flex-col items-center">
            <Image
              src="/dev.png"
              alt="Developer Icon"
              width={150}
              height={150}
              className="mb-6 opacity-90"
            />
            <h2 className="text-xl font-bold tracking-wide">
              ZEDRICK <br /> ESPIRITU
            </h2>
          </div>

          {/* Developer 3 */}
          <div className="flex flex-col items-center">
            <Image
              src="/dev.png"
              alt="Developer Icon"
              width={150}
              height={150}
              className="mb-6 opacity-90"
            />
            <h2 className="text-xl font-bold tracking-wide">
              JUNE JELO <br /> ALCANTARA
            </h2>
          </div>

          {/* Developer 4 */}
          <div className="flex flex-col items-center">
            <Image
              src="/dev.png"
              alt="Developer Icon"
              width={150}
              height={150}
              className="mb-6 opacity-90"
            />
            <h2 className="text-xl font-bold tracking-wide">
              LINDELL <br /> CONSTANTINO
            </h2>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
