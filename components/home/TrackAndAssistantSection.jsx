// components/home/TrackAndAssistantSection.jsx
export default function TrackAndAssistantSection() {
  return (
    <section
      id="track"
      className="border-b border-[#151515] bg-[#050505] py-10 sm:py-14 scroll-mt-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.3fr,1fr]">
        {/* Your Reports */}
        <div className="rounded-2xl border border-[#222] bg-[#0B0B0B] p-6 sm:p-7">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Your Reports
          </h3>
          <p className="text-xs sm:text-sm text-[#B0B0B0] mb-4">
            Find your reports
          </p>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="e.g., MH-012"
              className="w-full rounded-lg border border-[#333] bg-black px-3 py-2 pr-10 text-sm outline-none focus:border-[#FF8A00]"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-[#FF8A00]">
              🔍
            </span>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="rounded-2xl border border-[#222] bg-[#0B0B0B] p-6 sm:p-7">
          <h3 className="text-lg sm:text-xl font-semibold">
            AI Assistant (MARI)
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#B0B0B0]">
            Need help with barangay papers? Our AI will guide you through the
            process, requirements, and where to go.
          </p>

          <div className="mt-4 rounded-xl bg-black/40 p-4">
            <p className="mb-2 text-xs font-semibold text-[#E0E0E0]">
              Sample prompts
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[#C0C0C0]">
              <li>How can I get barangay clearance?</li>
              <li>
                What are the requirements if I want to get a certificate of
                indigency?
              </li>
              <li>What are the office hours of the barangay?</li>
            </ul>
          </div>

          <button className="mt-5 rounded-lg bg-[#FF8A00] px-4 py-2 text-xs font-semibold text-black hover:bg-[#ff9f2e] transition">
            Ask MARI
          </button>
        </div>
      </div>
    </section>
  );
}
