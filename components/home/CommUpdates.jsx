// components/home/CommUpdatesSection.jsx

import { publicsans, inter, georama } from "../../lib/fonts";

export default function CommUpdatesSection() {
  return (
    <section
      id="dashboard"
      className="border-b border-[#151515] bg-[#050505] py-10 sm:py-14 scroll-mt-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Community Updates */}
        <div id="updates">
          <h2
            className={`${publicsans.className} text-2xl sm:text-3xl font-bold mb-4 text-[#FF890B]`}
          >
            Community Updates
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <UpdateCard
              title="Purok Cleanup Drive"
              text="Saturday, 8 AM – Concepcion Uno. Volunteers are welcome."
            />
            <UpdateCard
              title="Road Repair Advisory"
              text="Sto. Niño: Partial closure along E. Dela Paz (Oct. 10–14)."
            />
            <UpdateCard
              title="Flood Watch"
              text={
                <>
                  Marikina River alert level:{" "}
                  <span className="text-green-400 font-semibold">Normal</span>.
                </>
              }
            />
          </div>
        </div>

        {/* Transparency Stats */}
        <div>
          <h2
            className={`${publicsans.className} text-2xl sm:text-3xl font-bold mb-4 text-[#FF890B]`}
          >
            Transparency Stats
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Reports this month" value="368" />
            <StatCard label="Resolved" value="82%" />
            <StatCard label="Avg. resolution time" value="4d 6h" />
            <StatCard label="Active projects" value="12" />
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2
            className={`${publicsans.className} text-2xl sm:text-3xl font-bold mb-4 text-[#FF890B]`}
          >
            What residents say
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <QuoteCard
              text="I reported a pothole and it was fixed within 48 hours. - Macy"
            />
            <QuoteCard text="Clear updates and easy tracking. Salamat! - Max" />
            <QuoteCard text="Anonymous reporting made me feel safe. - Arnel" />
          </div>
        </div>
      </div>
    </section>
  );
}

function UpdateCard({ title, text }) {
  return (
    <div className="rounded-xl border border-[#222] bg-[#0B0B0B] p-4 sm:p-5">
      <h4
        className={`${georama.className} font-semibold text-sm sm:text-base`}
      >
        {title}
      </h4>
      <p
        className={`${inter.className} mt-2 text-[2px] sm:text-sm text-[#C0C0C0]`}
      >
        {text}
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#222] bg-[#0B0B0B] px-4 py-5 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-[#C0C0C0]">{label}</div>
    </div>
  );
}

function QuoteCard({ text }) {
  return (
    <div className="rounded-xl border border-[#222] bg-[#0B0B0B] p-4 sm:p-5 text-sm text-[#E0E0E0]">
      <p className={`${inter.className} text-sm sm:text-base`}>{text}</p>
    </div>
  );
}
