import Image from "next/image";
import { abeezee, inter } from "lib/fonts";

import homereportIcon from "../../src/assets/icons/homereport.svg";
import hometrackIcon from "../../src/assets/icons/hometrack.svg";
import homeaiIcon from "../../src/assets/icons/homeai.svg";
import homelguIcon from "../../src/assets/icons/homelgu.svg";

export default function HeroActionsSection() {
  return (
    <section
      id="actions"
      className="relative border-b border-[#151515] bg-black overflow-hidden"
    >
      {/* ORANGE OUTLINE BACKGROUND – same style as header hero */}
      <div
        className="absolute inset-0 text-orange-500 opacity-80 mix-blend-screen bg-no-repeat bg-right"
        style={{
          backgroundImage: "url('/marikinabg.png')",
          backgroundSize: "87%",
          backgroundPosition: "100% 10%",
        }}
      ></div>

      {/* DARK OVERLAY (like header) */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENT ON TOP */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-52">
        {/* Headline */}
        <div className="space-y-8 mb-10">
          <h1
            className={`${abeezee.className} text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight lg:whitespace-nowrap`}
          >
            <span className="text-[#FF8A00]">Report</span> with Ease.&nbsp;
            <span className="text-[#FF8A00]">Track</span> with Confidence.
          </h1>

          <p
            className={`${inter.className} text-[20px] text-[#D0D0D0]`}
          >
            Welcome to the Marikina Heights Community System — report issues,
            track progress, and get help fast.
          </p>
        </div>


        {/* Action cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          <ActionCard
            iconSrc={homereportIcon}
            title="Report an issue"
            text="Streetlight, trash, pothole, flooding, etc."
            href="#submit-report"
          />
          <ActionCard
            iconSrc={hometrackIcon}
            title="Track your reports"
            text="Check the status using the report ID."
            href="#track"
          />
          <ActionCard
            iconSrc={homeaiIcon}
            title="Ask MARI, our AI assistant"
            text="Ask MARI for barangay document requirements and step-by-step instructions."
            href="#track"
          />
          <ActionCard
            iconSrc={homelguIcon}
            title="Marikina LGU"
            text="Hotlines and departments connected to this system."
            href="#hotlines"
          />
        </div>
      </div>
    </section>
  );
}

function ActionCard({ iconSrc, title, text, href }) {
  return (
    <a href={href} className="block h-full group">
      <div className="h-full flex flex-col rounded-xl border border-[#222] bg-[#0C0C0C] p-5 shadow-sm cursor-pointer transition group-hover:border-[#FF8A00] group-hover:bg-[#111111]">
        <div className="mb-3 flex items-center gap-3">
          {/* SVG ONLY – no orange container */}
          <div className="flex h-8 w-8 items-center justify-center shrink-0">
            <Image
              src={iconSrc}
              alt={title}
              width={28}
              height={28}
              className="h-7 w-7 object-contain block"
            />
          </div>

          <h3 className="font-semibold text-sm sm:text-base leading-snug">
            {title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#B0B0B0]">{text}</p>
      </div>
    </a>
  );
}
