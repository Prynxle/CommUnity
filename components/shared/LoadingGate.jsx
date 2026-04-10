"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "./LogoLoader";

const LoadingGateInner = ({ children, minDuration = 1500, label = "Loading" }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!showContent) {
    return <LogoLoader label={label} />;
  }

  return <>{children}</>;
};

const LoadingGate = ({ children, minDuration = 1500, label = "Loading" }) => {
  const pathname = usePathname();

  return (
    <LoadingGateInner key={`${pathname}:${minDuration}`} minDuration={minDuration} label={label}>
      {children}
    </LoadingGateInner>
  );
};

export default LoadingGate;

