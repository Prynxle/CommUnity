"use client";

import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import CircularGallery from "../../components/devUI/CircularGallery";

const developerItems = [
  { image: "/olopsc.jpg", text: "Anne Trixie Urbano" },
  { image: "/MarHeights.jpg", text: "Zedrick Espiritu" },
  { image: "/typing.jpg", text: "June Jelo Alcantara" },
  { image: "/marikinabg.png", text: "Lindell Constantino" },
  { image: "/cards/student.jpg", text: "CommUnity" },
  { image: "/cards/reportwriting.jpg", text: "Developer Team" },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#3b1f88,_#130728_55%,_#06030e)] text-white flex flex-col">
      <Header />
      <main className="flex-1 px-6 pt-20 pb-12 sm:px-10 lg:px-16">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FFEB00]">Developer Team</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">CommUnity builders, presented in the gallery view.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              This page uses the `CircularGallery` component from the `devUI` folder as the main developer showcase.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <div className="h-[540px] overflow-hidden rounded-[24px] bg-black/20">
              <CircularGallery
                items={developerItems}
                bend={2}
                textColor="#F8FAFC"
                borderRadius={0.06}
                scrollSpeed={2.2}
                scrollEase={0.08}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
