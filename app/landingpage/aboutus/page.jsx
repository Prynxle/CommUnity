import Header from "../../../components/landing/Header.jsx";
import PurposeGuidelinesSection from "../../../components/landing/PurposeGuidelinesSection.jsx";
import Footer from "../../../components/landing/Footer.jsx";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header hideHero />
      <main className="flex-1 pt-[90px]">
        <PurposeGuidelinesSection />
      </main>
      <Footer />
    </div>
  );
}

