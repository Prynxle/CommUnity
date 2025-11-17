import React from "react";
import Header from "../../../components/landing/Header.jsx";
import DidYouKnow from "../../../components/landing/DidYouKnow.jsx";
import WhyCommunitySystem from "../../../components/landing/WhyCommunitySystem.jsx";
import MV from "../../../components/landing/MV.jsx";
import HowItWorks from "../../../components/landing/HowItWorks.jsx"; // ✅ FIXED
import FAQ from "../../../components/landing/FAQ.jsx";
import Footer from "../../../components/landing/Footer.jsx";

const Page = () => {
  return (
    <div>
      <Header />
      <DidYouKnow />
      <WhyCommunitySystem />
      <MV />
      <HowItWorks />   {/* ✅ ADDED HERE */}
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
