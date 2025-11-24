import { georama, poppins } from "../../lib/fonts";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1E1E1E] bg-black/90 backdrop-blur">
      {/* Full-width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Flex container that pushes left + right */}
        <div className="flex items-center justify-between py-3 h-[80px]">

          {/* Logo + Text */}
          <div className="flex items-center">
            <img
              src="/LOGO1.png"
              alt="CommUnity Logo"
              className="h-[60px] sm:h-[80px] md:h-[110px] w-auto object-contain"
            />
            <span
              className={`${georama.className} font-extrabold text-white text-[22px] sm:text-[26px] md:text-[24px] tracking-[0.25em] -ml-[50px]`}
            >
              COMM<span className="text-orange-500">UNITY</span>
            </span>
          </div>

          {/* RIGHT SIDE — Navigation */}
          <div className="flex items-center gap-10">
            <nav
              className={`${poppins.className} hidden md:flex items-center gap-12 text-sm`}
            >
              <a href="#actions" className="hover:text-[#FF8A00]">Actions</a>
              <a href="#track" className="hover:text-[#FF8A00]">Track</a>
              {/* Updates removed here */}
              <a href="#dashboard" className="hover:text-[#FF8A00]">Dashboard</a>
              <a href="#hotlines" className="hover:text-[#FF8A00]">Hotlines</a>

              <a
                href="#submit-report"
                className="rounded-md bg-[#FF8A00] px-3 py-2 text-xs font-semibold text-black hover:bg-[#ff9f2e] transition"
              >
                Report Now
              </a>
            </nav>

            {/* User */}
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">Hi, Ganda!</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF8A00]">
                <span className="text-xs">👤</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
