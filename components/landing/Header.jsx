import Link from "next/link";
import Image from "next/image";
import { georama, abeezee, inter } from "../../lib/fonts";



const Header = () => {
  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-black bg-opacity-70 h-[80px]">
        <div className="w-full flex items-center justify-between h-full px-6">

          {/* Logo + Text */}
          <div className="flex items-center">
            <span
              className={`${georama.className} font-extrabold text-white text-[26px] sm:text-[28px] md:text-[30px] tracking-[0.25em] -ml-[-10px]`}
            >
              COMM<span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* Nav Items */}
          <div className={`${inter.className} flex flex-col sm:flex-row items-center text-gray-300 text-[12px] sm:text-[14px] gap-6 sm:gap-10 md:gap-8`}>
            <a href="#home" className="hover:text-orange-400 transition">Home</a>
            <a href="#sdg" className="hover:text-orange-400 transition">SDG</a>
            <a href="#developers" className="hover:text-orange-400 transition">Developers</a>
            <Link href="/login" className="hover:text-orange-400 transition">Sign In</Link>
            <Link href="#signup"className="text-gray-300 border border-white px-3 py-[2px] rounded-md hover:bg-white hover:text-black transition">Sign Up</Link>
          </div>
        </div>

        {/* Subtle Bottom Border */}
        <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-white/0 via-white/5 to-white/0"></div>
      </nav>


      {/* ===== HERO HEADER SECTION WITH ORANGE OUTLINE BG ===== */}
      <header
        className="
          relative w-full 
          h-[700px] 
          sm:h-[800px] 
          md:h-[900px] 
          lg:h-[1000px] 
          xl:h-[800px]
          mt-16 overflow-hidden bg-black
        "
      >

        {/* ORANGE OUTLINE BACKGROUND */}
        <div
          className="absolute inset-0 text-orange-500 opacity-80 mix-blend-screen bg-no-repeat bg-right"
          style={{
            backgroundImage: "url('/marikinabg.png')",
            backgroundSize: "87%",
            backgroundPosition: "100% 10%",
          }}
        ></div>

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* HERO TEXT CONTENT */}
        <div className="relative z-10 container mx-auto text-center px-8 pt-48 pb-20">

          {/* HEADLINE */}
          <h1 className={`${abeezee.className} text-white text-4xl sm:text-5xl md:text-6xl font-normal text-center`}>

            <span className="text-orange-500">Report</span> with Ease.

            {/* BIG GAP HERE */}
            <div className="mt-10"></div>

            <span className="text-orange-500">Track</span> with Confidence.
          </h1>



          <p className="text-[20px] sm:text-[22px] text-white/90 leading-relaxed max-w-4xl mx-auto mt-8 font-inter">
            Easily report community issues and stay updated – with CommUnity,

            {/* Move second line downward */}
            <span className="block mt-0">
              your voice is heard and action is just a click away!
            </span>
          </p>


          {/* BUTTONS */}
          <div className="flex justify-center gap-6 mt-10">
            <a
              href="#get-started"
              className="bg-orange-500 text-white px-8 py-3 rounded-md font-medium hover:opacity-90 transition font-abeezee"
            >
              Get Started
            </a>

            <a
              href="#learn-more"
              className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-black transition font-abeezee"
            >
              Learn More
            </a>
          </div>

        </div>

      </header>
    </>
  );
};

export default Header;
