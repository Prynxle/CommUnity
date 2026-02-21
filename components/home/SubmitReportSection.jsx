"use client";

import { useState } from "react";
import { poppins } from "../../lib/fonts";

export default function SubmitReportSection() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.querySelector('input[name="photo"]');
    if (fileInput?.files?.[0]) {
      formData.set("photo", fileInput.files[0]);
    }
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to submit report.");
        return;
      }
      setStatus("success");
      setMessage("Report submitted successfully. Thank you.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="submit-report"
      className="border-b border-[#151515] bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h2 className={`${poppins.className} text-2xl sm:text-3xl font-semibold mb-6`}>
          Submit a Report
        </h2>

        <div className="rounded-2xl border border-[#222] bg-[#0B0B0B] p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {message && (
              <p
                className={`text-sm ${
                  status === "success" ? "text-green-500" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            {/* Names & Contact */}
            <div className="grid gap-4 md:grid-cols-2">
              <InputField name="first_name" label="First Name (optional)" placeholder="John" />
              <InputField name="last_name" label="Last Name (optional)" placeholder="Doe" />
              <InputField name="email" label="E-mail" placeholder="you@example.com" type="email" required />
              <InputField name="mobile_number" label="Mobile Number" placeholder="Enter your mobile number" type="tel" />
            </div>

            {/* Street + Issue Type */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                name="street"
                label="Street"
                options={[
                  "Aba Street",
                  "Apitong Street",
                  "Aquatius Street",
                  "Ariane Road",
                  "Bayan-Bayanan Avenue (Secondary)",
                  "Bayan-Bayanan Extension",
                  "Betel Nut Street",
                  "Bamboo Palm Street",
                  "Betlehem Street",
                  "Big Big Street",
                  "Bob White Street",
                  "Bonanza Street (Tertiary)",
                  "Bougainvillea Lane",
                  "Branding Iron Street",
                  "Cacharel Street",
                  "Champaca Street",
                  "Capricorn Street",
                  "Champagnat Street (Tertiary)",
                  "Coco Palm Street",
                  "Colt Street",
                  "Corral Street",
                  "Date Palm Street",
                  "Dao Street",
                  "Daylight Street",
                  "Diamond Street",
                  "Emerald Street",
                  "Firethorn Street",
                  "E. Rodriguez Street (Service)",
                  "East Drive Street (Tertiary)",
                  "F. Balagtas Street",
                  "F. Balagtas Street (Secondary)",
                  "Fatima Lane",
                  "Fortune Avenue",
                  "G. Del Pilar Street (Tertiary)",
                  "Gardenia Drive",
                  "Gardenia Lane",
                  "Gemini Street",
                  "General B.G. Molina Street (Tertiary)",
                  "General Menez Street",
                  "General Ordoñez Street (Secondary)",
                  "Givenchy Street",
                  "Gomez Street",
                  "Gucci Street",
                  "Halston Street",
                  "Hereford Street",
                  "Hornbill Street",
                  "Ipil Street",
                  "Ivory Palm Street",
                  "Jasmine Street",
                  "Jade Street",
                  "Jerusalem Street",
                  "J. Molina Street (Tertiary)",
                  "J.J. Carlos PAG-IBIG Subdivision",
                  "Kapayapaan Street",
                  "Kaginhawaan Street",
                  "Katarungan Street",
                  "Katipunan Street (Tertiary)",
                  "Ladislao Diwa Street",
                  "Lakandula Street",
                  "Lakandula Extension",
                  "Lauren Street",
                  "Leo Street",
                  "Libra Street",
                  "Liwasang Kalayaan Street (Tertiary)",
                  "Longhorn Street",
                  "Lope K. Santos Street (Tertiary)",
                  "Lourdes Street",
                  "Lopez Jaena Street",
                  "Lourdes Drive",
                  "Lower Paraiso (Service)",
                  "M.L. Quezon Street",
                  "M. Tuazon Street",
                  "Manacop Street",
                  "Malipajo Street",
                  "Mansanas Street",
                  "Mansanitas Street",
                  "Merino Street",
                  "Mohair Street",
                  "Mohawk Street",
                  "Montserrat Hill Street",
                  "N. Sevilla Street (Tertiary)",
                  "Narra Street (Tertiary)",
                  "Northwest Street",
                  "Opal Street",
                  "P. Burgos Street",
                  "P. Lopez Street",
                  "P. Paterno Street",
                  "P. Valenzuela Street",
                  "Paddock Street",
                  "Padre Gomez Street",
                  "Palm Drive",
                  "Palomino Street",
                  "Paraiso Street",
                  "Paraiso Street (Tertiary)",
                  "Pisces Street",
                  "Pony Street",
                  "Puffin Street",
                  "Queen Palm Street",
                  "R. Magsaysay Street",
                  "Rajah Matanda Street",
                  "Ramdale Homes (Service)",
                  "Rancho Avenue",
                  "Remuda Street",
                  "Rodenna III Street",
                  "Rodeo Street",
                  "Royal Palm Street",
                  "Ruby Street",
                  "Sagittarius Street",
                  "Saint Joseph Street",
                  "Saint Jude Street",
                  "Sampaguita Street",
                  "Santa Bernadita Street",
                  "Santa Elena Street",
                  "Santa Isabel Street",
                  "Santa Monica Street",
                  "Santa Veronica Street",
                  "Sapphire Street",
                  "Spring Street",
                  "Spur Street",
                  "Stallion Street",
                  "Sumulong Street",
                  "T. Bugallon Extension",
                  "Tanguile Street",
                  "Tatiana Street",
                  "Teodora Park",
                  "Torres Bugallon Street",
                  "Virgo Street",
                  "West Drive Street (Tertiary)",
                  "Winter Street",
                  "Wrangler Street",
                  "Zamora Street",
                  "10th Avenue",
                  "11th Avenue",
                  "2nd Street",
                  "3rd Street",
                  "4th Street",
                  "5th Street",
                  "8th Avenue",
                  "9th Avenue",
                ]}
              />

              <SelectField
                name="issue_type"
                label="Issue Type"
                defaultLabel="Choose the type of issue"
                options={[
                  "Streetlight",
                  "Garbage",
                  "Pothole",
                  "Flooding",
                  "Animal Care and Shelter Services",
                  "Business Permits and Licensing",
                  "Environmental Management",
                  "City Health Services",
                  "Public Market Administration",
                  "Social Welfare & Community Development",
                  "City Treasury Services",
                  "Community Relations Office",
                  "City Engineering Services",
                  "Human Resource Management",
                  "Tourism & Cultural Affairs",
                  "Marikina Sports Center",
                  "Senior Citizens’ Services",
                  "Public Safety & Security",
                  "Office of the Mayor",
                  "Urban Parks Development",
                  "River Parks Management",
                  "School Maintenance & Repair",
                ]}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#E0E0E0]">Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the issue, when it occurs, and any landmark..."
                className="w-full rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#FF8A00] resize-none"
              />
            </div>

            {/* File + Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#E0E0E0]">Attach Photo (optional)</label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="block text-xs text-[#B0B0B0] file:mr-3 file:rounded-md file:border-0 file:bg-[#FF8A00] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-[#ff9f2e]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="self-start rounded-lg bg-[#FF8A00] px-5 py-2 text-sm font-semibold text-black hover:bg-[#ff9f2e] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting…" : "Submit Report"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}

/* Reusable fields */
function InputField({ name, label, placeholder, type = "text", required }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#E0E0E0]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#FF8A00]"
      />
    </div>
  );
}

function SelectField({ name, label, options = [], defaultLabel = "Choose a street" }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#E0E0E0]">{label}</label>

      <select
        name={name}
        defaultValue=""
        required
        className="
          w-full rounded-lg border border-[#333] bg-black 
          px-3 py-2 pr-8 text-sm 
          outline-none focus:border-[#FF8A00]
        "
      >
        <option value="" disabled>
          {defaultLabel}
        </option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
