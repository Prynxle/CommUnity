// app/page.jsx
import React from "react";
import Header from "../components/Header";
import DidYouKnow from "../components/DidYouKnow";
import WhyCommunitySystem from "../components/WhyCommunitySystem";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

const Page = () => {
  return (
    <div>
      <Header />
      <DidYouKnow />
      <WhyCommunitySystem />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;