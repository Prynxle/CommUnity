// app/landingpage/page.jsx — Marketing page
// Purpose: Present the product story: header, facts, value props, FAQs, and footer.
// Why: A non-auth public route to explain the system before sign-in.
import React from "react";
import Header from "../../components/landing/Header";
import DidYouKnow from "../../components/landing/DidYouKnow";
import WhyCommunitySystem from "../../components/landing/WhyCommunitySystem";
import FAQ from "../../components/landing/FAQ";
import Footer from "../../components/landing/Footer";

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