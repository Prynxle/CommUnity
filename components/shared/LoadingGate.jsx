"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "./LogoLoader";

const LoadingGate = ({ children, minDuration = 1500, label = "Loading" }) => {
  const pathname = usePathname();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
    const timer = setTimeout(() => setShowContent(true), minDuration);
    return () => clearTimeout(timer);
  }, [pathname, minDuration]);

  if (!showContent) {
    return <LogoLoader label={label} />;
  }

  return <>{children}</>;
};

export default LoadingGate;

