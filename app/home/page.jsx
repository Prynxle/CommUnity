"use client";

import Header from "../../components/home/Header";
import Hero from "../../components/home/Hero";
import SubmitReportSection from "../../components/home/SubmitReportSection";
import TrackAndAssistantSection from "../../components/home/TrackAndAssistantSection";
import CommUpdates from "../../components/home/CommUpdates";
import HotlinesSection from "../../components/home/HotlinesSection";
import Footer from "../../components/home/Footer";
import Chatbot from "../../components/home/Chatbot"; // ✅ add this (adjust path if needed)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* ✅ Sticky Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <Hero />
        <SubmitReportSection />
        <TrackAndAssistantSection />
        <CommUpdates />
        <HotlinesSection />
      </main>

      <Footer />

      {/* ✅ Floating MARI Chatbot */}
      <Chatbot />
    </div>
  );
}