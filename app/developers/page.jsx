"use client";

import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import CircularGallery from "../../components/devUI/CircularGallery";

const developerItems = [
  { image: "/xie.jpg", text: "Anne Trixie Urbano", link: "https://music.youtube.com/watch?v=-ZmIN2iP9C0&list=RDAMVM7_o3L4btsyw" },
  { image: "/zedrick.jpg", text: "Zedrick Espiritu" },
  { image: "/typing.jpg", text: "June Jelo Alcantara" },
  { image: "/lindell.jpg", text: "Lindell Constantino", },
];


{developerItems.map((dev, index) => (
  <a 
    key={index} 
    href={dev.link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block mb-4"
  >
    <div className="flex items-center gap-3">
      <img src={dev.image} alt={dev.text} className="w-12 h-12 rounded-full" />
      <p>{dev.text}</p>
    </div>
  </a>
))}

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#3b1f88,_#130728_55%,_#06030e)] text-white flex flex-col">
      <Header />
      <main className="flex-1 px-6 pt-20 pb-12 sm:px-10 lg:px-16">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FFEB00]">Development and Research Team</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">CommUnity</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
          We’re the team behind the CommUnity thesis project, working together across development and research to turn our shared vision into something real.
           Each of us brings our own strengths and perspectives, collaborating closely to build and refine the platform. <br /> <br />

           • Anne Trixie Urbano — Research & Front-End Development <br />
           • Zedrick Espiritu — Research & Full Stack Development <br />
           • June Jelo Alcantara — Research <br />
           • Lindell Constantino — Research <br /><br />

          Together, we combine our skills and ideas to create something meaningful for the community.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <div className="h-[540px] overflow-hidden rounded-[24px] bg-black/20">
              <CircularGallery
                items={developerItems}
                bend={1}
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
