"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { abeezee, oxanium, worksans } from "../../lib/fonts";

import submitIcon from "../../src/assets/icons/submit.svg";
import acknowledgmentIcon from "../../src/assets/icons/acknowledge.svg";
import trackIcon from "../../src/assets/icons/status.svg";
import updatesIcon from "../../src/assets/icons/receive.svg";

const steps = [
  {
    title: "Submit Report",
    icon: submitIcon,
    popover: (
      <div>
        <strong>How to Submit Report:</strong>
        <br /><br />

        <strong>Step 1:</strong> Put your credentials (optional)
        <br /><br />

        <strong>Step 2:</strong> Choose a Street <br />
        Select the street where the issue occurred.
        <br /><br />

        <strong>Step 3:</strong> Choose the type of issue <br />
        Select the type of issue you want to report. (e.g., waste, road damage,
        streetlight problem, etc.)
        <br /><br />

        <strong>Step 4:</strong> Describe your report/issue <br />
        Describe the issue, when it occurs, and any landmark.
        <br /><br />

        <strong>Step 5:</strong> Attach Photo <br />
        Upload clear pictures or short clips of the issue. (Allowed formats: JPG, PNG)
        <br /><br />

        <strong>Step 6:</strong> Review Your Report <br />
        Double-check all information before you submit. Make sure every detail is accurate.
        <br /><br />

        <strong>Step 7:</strong> Submit Report <br />
        Click the “Submit” button to send your report to the system.
      </div>
    ),
  },
  {
    title: "Receive Acknowledgment",
    icon: acknowledgmentIcon,
    popover: (
      <div>
        The barangay officials will send an acknowledgement to the users once the
        report has been received, viewed, or observed. This acknowledgement confirms
        that the report has been processed and is being reviewed for further action.
        Users will be kept informed of the status and any subsequent steps regarding
        their report.
      </div>
    ),
  },
  {
    title: "Track Report Status",
    icon: trackIcon,
    popover: (
      <div>
        Users can search for their submitted reports using the unique report ID.
        They will be able to view the progress of their report, including its current
        stage—whether it has been acknowledged, is ongoing, or has been resolved.
      </div>
    ),
  },
  {
    title: "Receive Updates",
    icon: updatesIcon,
    popover: (
      <div>
        Users automatically receive notifications through email and in-app alerts
        whenever there are changes to their report’s status. This ensures they stay
        informed about the progress and resolution of their submitted concerns.
      </div>
    ),
  },
];

// --------------------------------------------------
// STEP COMPONENT
// --------------------------------------------------
const Step = ({ step, index, activeIndex, togglePopover, popoverRefs }) => {
  return (
    <div key={index} className="flex items-center">
      <div className="relative flex flex-col items-center">

        {/* ICON */}
        <div
          onClick={() => togglePopover(index)}
          className="
            group w-20 h-20 rounded-full bg-[#2A2A2A]
            flex items-center justify-center
            hover:bg-orange-600 transition-all duration-300
            cursor-pointer shadow-lg
          "
        >
          <Image
            src={step.icon}
            alt={step.title}
            width={40}
            height={40}
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* TITLE — WORK SANS */}
        <p className={`${worksans.className} text-[16px] mt-3 text-center`}>
          {step.title}
        </p>

        {/* POPOVER */}
        {activeIndex === index && (
          <div
            ref={(el) => (popoverRefs.current[index] = el)}
            className="
              absolute top-[110%] left-1/2 -translate-x-1/2
              w-72 md:w-80 bg-[#2b2b2b] text-gray-200
              p-5 rounded-xl shadow-xl border border-gray-700
              z-20 animate-fadeIn text-sm leading-relaxed
            "
          >
            {step.popover}
          </div>
        )}
      </div>

      {/* CONNECTOR */}
      {index < steps.length - 1 && (
        <div className="hidden md:flex items-center ml-6">
          <div className="w-28 border-t border-dashed border-gray-400 opacity-80"></div>
          <div className="w-2.5 h-2.5 rotate-45 bg-white ml-3"></div>
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------
const HowItWorks = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const popoverRefs = useRef([]);

  // CLICK OUTSIDE TO CLOSE POPOVER
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRefs.current.some((ref) => ref && ref.contains(e.target))) return;
      setActiveIndex(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopover = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-28 bg-black text-white">

      {/* SECTION TITLE */}
      <h2
        className={`${oxanium.className} text-center text-[56px] mb-20 tracking-wide`}
      >
        How it works
      </h2>

      {/* STEPS */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-12">
        {steps.map((step, index) => (
          <Step
            key={index}
            step={step}
            index={index}
            activeIndex={activeIndex}
            togglePopover={togglePopover}
            popoverRefs={popoverRefs}
          />
        ))}
      </div>

      {/* BOTTOM DIVIDER LINE */}
      <div className="w-full border-b border-[#2A2A2A] mt-20"></div>

      {/* ANIMATION */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>

    </section>
  );
};

export default HowItWorks;
