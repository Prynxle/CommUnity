"use client";

import Image from "next/image";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const developerItems = [
  {
    image: "/xie.jpg",
    name: "Anne Trixie Urbano",
    role: "Research & Front-End Development",
    link: "https://www.facebook.com/xie.xie.182381",
  },
  {
    image: "/zedrick.jpg",
    name: "Zedrick Espiritu",
    role: "Researcher & Full Stack Development",
    link: "https://github.com/Prynxle",
  },
  {
    image: "/jelo.jpg",
    name: "June Jelo Alcantara",
    role: "Researcher",
    link: "https://www.facebook.com/alcantarajelo",
  },
  {
    image: "/lindell.jpg",
    name: "Lindell Constantino",
    role: "Researcher",
    link: "https://www.facebook.com/lindexx.constantino",
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#3b1f88,_#130728_55%,_#06030e)] text-white flex flex-col">
      <Header />
      <main className="flex-1 px-4 pb-12 pt-20 sm:px-8 lg:px-14">
        <section className="mx-auto w-full max-w-7xl py-8 sm:py-12">
          <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FFEB00] sm:text-sm">
              Development and Research Team
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              CommUnity Developers
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/80 sm:text-base">
              We are the development team behind the CommUnity System, a web-based incident 
              reporting platform for OLOPS College. Through a collaborative process that integrates research, 
              user-centered design, and software development, we create and refine the system to provide students and 
              administrators with a structured, transparent, and accessible tool for reporting, tracking, and managing school-related concerns.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {developerItems.map((dev) => (
              <article
                key={dev.name}
                className="group rounded-3xl border border-white/15 bg-white/[0.05] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-[#FFEB00]/50"
              >
                <a
                  href={dev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={`Visit ${dev.name} profile`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={dev.image}
                      alt={dev.name}
                      width={640}
                      height={640}
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-56 lg:h-60"
                      sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                </a>

                <div className="mt-4 space-y-1">
                  <h2 className="text-lg font-semibold leading-tight text-white">
                    {dev.name}
                  </h2>
                  <p className="text-sm text-white/75">{dev.role}</p>
                </div>

                <a
                  href={dev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 transition hover:border-[#FFEB00] hover:text-[#FFEB00]"
                >
                  View Profile
                </a>
              </article>
            ))}
          </div>


        </section>
      </main>
      <Footer />
    </div>
  );
}
