import React from "react";
import Header from "../../components/landing/Header.jsx";
import DidYouKnow from "../../components/landing/DidYouKnow.jsx";
import WhyCommunitySystem from "../../components/landing/FeaturesSchoolSection.jsx";
import MV from "../../components/landing/PurposeGuidelinesSection.jsx";
import HowItWorks from "../../components/landing/HowItWorks.jsx";
import FAQ from "../../components/landing/FAQ.jsx";
import Footer from "../../components/landing/Footer.jsx";
import FeaturesSchoolSection from "../../components/landing/FeaturesSchoolSection.jsx";
import PurposeGuidelinesSection from "../../components/landing/PurposeGuidelinesSection.jsx";


const Page = () => {
  return (
    <div>
      <Header />
      <FeaturesSchoolSection />
      <PurposeGuidelinesSection />
      <HowItWorks />   {/* ✅ ADDED HERE */}
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
