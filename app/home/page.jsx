"use client";

import Header from "../../components/home/Header";
import Hero from "../../components/home/Hero";
import SubmitReportSection from "../../components/home/SubmitReportSection";
import TrackAndAssistantSection from "../../components/home/TrackAndAssistantSection";
import CommUpdates from "../../components/home/CommUpdates";
import HotlinesSection from "../../components/home/HotlinesSection";
import Footer from "../../components/home/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      {/* Main scrollable content */}
      <main className="flex-1 pb-20">
        <Hero />
        <SubmitReportSection />
        <TrackAndAssistantSection />
        <CommUpdates />
        <HotlinesSection />
      </main>

      <Footer />

      {/* Floating Ask MARI button */}
      <button className="fixed bottom-6 right-6 z-40 rounded-full bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-[#ff9f2e] transition">
        Ask MARI
      </button>
    </div>
  );
}
