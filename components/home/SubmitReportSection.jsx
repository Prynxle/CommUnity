"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { poppins } from "../../lib/fonts";
import { FiCopy } from "react-icons/fi";

export default function SubmitReportSection() {
  const [locationCategory, setLocationCategory] = useState("");
  const [subLocation, setSubLocation] = useState("");
  const [category, setCategory] = useState("");

  const locationOptions = useMemo(
    () => [
      { label: "Entrance", value: "Entrance", sub: [] },
      {
        label: "1st floor",
        value: "1st floor",
        sub: [
          "Registrar",
          "LRC",
          "Dean's Office",
          "Research Office",
          "Guidance Office",
          "Hallway",
          "Program Chair's Office",
        ],
      },
      { label: "2nd floor", value: "2nd floor", sub: ["201", "202", "203", "204", "205", "206"] },
      { label: "3rd floor", value: "3rd floor", sub: ["301", "302", "303", "304", "305", "306"] },
      { label: "4th floor", value: "4th floor", sub: ["401", "402", "403", "404", "405", "406"] },
      { label: "Rooftop", value: "Rooftop", sub: [] },
    ],
    []
  );

  const activeSubList =
    locationCategory && locationOptions.find((o) => o.value === locationCategory)?.sub?.length
      ? locationOptions.find((o) => o.value === locationCategory).sub
      : [];

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [submittedReportId, setSubmittedReportId] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyReportId = useCallback((reportId) => {
    if (!reportId) return;
    navigator.clipboard.writeText(reportId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  // label size (small)
  const smallLabel = "text-[14px] sm:text-[15px] font-semibold text-gray-800";

  // ✅ text sizing (typed + placeholder)
  const formText = "text-[14px] sm:text-[15px]";
  const formPlaceholder = "placeholder:text-[14px] sm:placeholder:text-[15px] placeholder:text-gray-400";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setSubmittedReportId(null);

    // ✅ manual required validation for custom dropdowns
    if (!category) {
      setStatus("error");
      setMessage("Please select a report category.");
      return;
    }
    if (!locationCategory) {
      setStatus("error");
      setMessage("Please select a location.");
      return;
    }
    if (activeSubList.length > 0 && !subLocation) {
      setStatus("error");
      setMessage("Please select a sub-location.");
      return;
    }

    const form = e.currentTarget;
    const fileInput = form.querySelector('input[name="photo"]');
    if (!fileInput?.files?.[0]) {
      setStatus("error");
      setMessage("Please attach evidence (a photo or screenshot).");
      return;
    }

    const formData = new FormData(form);
    formData.set("photo", fileInput.files[0]);

    try {
      const res = await fetch("/api/reports", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to submit report.");
        return;
      }

      const reportId = data.report_id ?? null;
      setSubmittedReportId(reportId);
      setStatus("success");
      setMessage("Report submitted successfully. Thank you.");

      form.reset();
      setCategory("");
      setLocationCategory("");
      setSubLocation("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="submit-report" className="relative overflow-hidden border-b border-gray-200 bg-white">
      {/* page background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-44 top-24 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[110px]" />
        <div className="absolute right-[-220px] top-[-140px] h-[560px] w-[560px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute left-1/2 top-20 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.10] blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-14 lg:px-8 overflow-hidden">
        <div className="mb-6 border-b-4 border-blue-600 pb-6">
          <h2 className={`${poppins.className} text-[28px] font-bold text-gray-900 sm:text-[34px]`}>
            Report an Incident or Concern
          </h2>
          <p className="mt-2 text-[18px] text-gray-700 sm:text-[20px]">
            Fill up the form below. Only the right office will be able to view the report.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
          {/* LEFT */}
          <aside className="rounded-2xl border border-gray bg-white p-4 sm:p-5 shadow-[0_8px_32px_rgba(38,28,193,0.12)]">
            <div className="text-[18px] font-semibold text-gray-800 sm:text-[20px]">Before you submit</div>

            <p className="mt-2 text-[15px] text-gray-700 sm:text-[16px]">
              <strong>Student welfare</strong> reports cover items like harassment, bullying, lack of ID, improper uniform, or any concern that affects a student’s wellbeing.
            </p>
            <p className="mt-1 text-[15px] text-gray-700 sm:text-[16px]">
              <strong>Medical-related incidents</strong> include injuries, trauma, illness, or anything that requires health/clinic attention.
            </p>
            <p className="mt-1 text-[15px] text-gray-700 sm:text-[16px]">
              If this is an emergency, call <strong>161</strong> right away and then submit a report when it is safe.
            </p>

            <ul className="mt-3 space-y-2.5 text-[16px] text-gray-700 sm:text-[18px]">
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Choose the Category of your Report.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Include location (Floor and Sublocation).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Be specific about what happened and when.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Leave blank your name if you want to be Anonymous.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Enter your Contact Email, This is where you Report ID will be sent. Please check your spam.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>Add evidence (required).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="mt-[3px] h-4 w-4 shrink-0" />
                <span>After submission, you will receive your Report ID. And will be sent into your email spam. You can copy that as your reference.</span>
              </li>
            </ul>

            <div className="mt-5 rounded-2xl border border-yellow-300/30 bg-yellow-50 p-4">
              <div className="text-[16px] font-semibold text-yellow-900 sm:text-[18px]">Emergency?</div>
              <p className="mt-2 text-[15px] leading-relaxed text-yellow-900/80 sm:text-[16px]">
                If there’s immediate danger, use the Help section for hotlines before submitting.
              </p>

              <a
                href="#hotlines"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-yellow-300 bg-yellow-100 px-4 py-3 text-[16px] font-semibold text-yellow-900 transition hover:bg-yellow-200 sm:text-[18px]"
              >
                Go to Help
              </a>
            </div>
          </aside>

          {/* RIGHT */}
          <div className="relative overflow-hidden rounded-2xl border border-gray bg-white shadow-[0_8px_32px_rgba(38,28,193,0.12)]">
            {/* ✅ Header: keep BLUE + YELLOW ombre ONLY at the top */}
            <div className="relative z-10 flex items-center justify-between gap-4 overflow-hidden border-b border-gray-200 px-5 py-6 text-white">
              <div className="pointer-events-none absolute inset-0 -z-10">
                {/* base ombre */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
                {/* glows */}
                <div className="absolute -left-24 top-[-70px] h-[260px] w-[260px] rounded-full bg-[#2F5BFF]/55 blur-[120px]" />
                <div className="absolute right-[-90px] bottom-[-90px] h-[280px] w-[280px] rounded-full bg-[#FFEB00]/55 blur-[130px]" />
                {/* slightly darken for readability */}
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div>
                <div className="text-[20px] font-bold sm:text-[22px]">Student Report Form</div>
                <div className="mt-1 text-[16px] text-white/90 sm:text-[15px]">All fields marked * are required.</div>
              </div>

              <span className="shrink-0 rounded-full border border-white/35 bg-white/95 px-3 sm:px-4 py-2 text-[13px] sm:text-[15px] font-semibold text-gray-700">
                Confidential
              </span>
            </div>

            {/* ✅ Form body: plain white (NO subtle yellow inside) */}
            <div className="relative z-10 bg-white px-4 sm:px-5 py-4 sm:py-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {message && (
                  <div
                    className={[
                      "rounded-xl border px-4 py-3 text-[14px]",
                      status === "success"
                        ? "border-green-500/25 bg-green-100 text-green-800"
                        : "border-red-500/25 bg-red-100 text-red-800",
                    ].join(" ")}
                  >
                    <p>{message}</p>
                    {status === "success" && submittedReportId && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-[13px] font-semibold text-green-900">Your Report ID:</span>
                        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-green-300/50 bg-white/80 px-3 py-2 font-mono text-[13px] text-gray-900">
                          <span className="truncate">{submittedReportId}</span>
                          <button
                            type="button"
                            onClick={() => copyReportId(submittedReportId)}
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            <FiCopy className="h-3.5 w-3.5" />
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <a
                          href="#track"
                          className="text-[13px] font-semibold text-green-800 underline underline-offset-2 hover:text-green-900"
                        >
                          Track this report →
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden inputs so FormData contains dropdown values */}
                <input type="hidden" name="category" value={category} />
                <input type="hidden" name="locationCategory" value={locationCategory} />
                <input type="hidden" name="subLocation" value={subLocation} />

                {/* Report Category (custom dropdown) */}
                <div className="space-y-2">
                  <Label className={smallLabel} required>
                    Report Category
                  </Label>
                  <AnimatedSelect
                    value={category}
                    onChange={setCategory}
                    placeholder="Select a category"
                    options={["Student Welfare", "Peer Conflict", "Harassment", "Trauma", "Medical Treatment (Open Wounds etc.)","Others"].map((x) => ({
                      label: x,
                      value: x,
                    }))}
                  />
                </div>

                {/* Location + Sub-location (custom dropdown) */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className={smallLabel} required>
                      Location
                    </Label>
                    <AnimatedSelect
                      value={locationCategory}
                      onChange={(v) => {
                        setLocationCategory(v);
                        setSubLocation("");
                      }}
                      placeholder="Select area/floor"
                      options={locationOptions.map((o) => ({ label: o.label, value: o.value }))}
                    />
                  </div>

                  {activeSubList.length > 0 && (
                    <div className="space-y-2">
                      <Label className={smallLabel} required>
                        Sub-location
                      </Label>
                      <AnimatedSelect
                        value={subLocation}
                        onChange={setSubLocation}
                        placeholder="Select sub-location"
                        options={activeSubList.map((s) => ({ label: s, value: s }))}
                      />
                    </div>
                  )}
                </div>

                {/* What happened */}
                <div className="space-y-2">
                  <Label className={smallLabel} required>
                    What happened?
                  </Label>
                  <textarea
                    name="description"
                    rows={5}
                    required
                    placeholder="Describe the incident/concern clearly. Include who was involved (if known) and what you observed."
                    className={[
                      "w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none",
                      "transition-all duration-200 ease-out hover:bg-white hover:border-blue-200",
                      "focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-200/40",
                      formText,
                      formPlaceholder,
                    ].join(" ")}
                  />
                </div>

                {/* Your name (optional for anonymity) */}
                <InputField
                  name="first_name"
                  label="Your name (optional)"
                  required={false}
                  labelClass={smallLabel}
                  placeholder="Leave blank if you want to be anonymous"
                  inputClass={[formText, formPlaceholder].join(" ")}
                />

                {/* Contact Email */}
                <InputField
                  name="email"
                  label="Contact Email"
                  required
                  labelClass={smallLabel}
                  type="email"
                  placeholder="This is where your Report ID will also be sent."
                  inputClass={[formText, formPlaceholder].join(" ")}
                />

                {/* Evidence */}
                <div className="space-y-2">
                  <Label className={smallLabel} required>
                    Evidence
                  </Label>
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    required
                    className={[
                      "block w-full text-[13px] text-gray-700 sm:text-[14px]",
                      "file:mr-3 file:rounded-lg file:border file:border-gray-300",
                      "file:bg-gray-100 file:px-3 file:py-2 file:font-semibold file:text-gray-800",
                      "hover:file:bg-gray-200",
                    ].join(" ")}
                  />
                  <p className="text-[12px] text-gray-500 sm:text-[13px]">Accepted: screenshots, photos, documents.</p>
                </div>

                {/* Confirmation */}
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <input type="checkbox" name="confirm" required className="mt-1 h-4 w-4 rounded border-gray-300 bg-white" />
                  <span className="text-[13px] leading-relaxed text-gray-700 sm:text-[14px]">
                    I confirm the information provided is accurate to the best of my knowledge.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-1">
                  <button
                    type="reset"
                    className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
                    onClick={() => {
                      setStatus("idle");
                      setMessage("");
                      setCategory("");
                      setLocationCategory("");
                      setSubLocation("");
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-10 rounded-xl border border-blue-600 bg-gradient-to-b from-blue-600 to-blue-500 px-5 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(38,28,193,0.10)] transition hover:shadow-[0_12px_32px_rgba(38,28,193,0.18)] disabled:cursor-not-allowed disabled:opacity-60 order-first sm:order-none"
                  >
                    {status === "loading" ? "Submitting…" : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* END RIGHT */}
        </div>
      </div>
    </section>
  );
}

/* ✅ red asterisk helper */
function Label({ children, required = false, className = "" }) {
  return (
    <label className={className}>
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

/* ✅ InputField */
function InputField({ name, label, placeholder, type = "text", required, labelClass, inputClass = "" }) {
  return (
    <div className="space-y-2">
      <Label className={labelClass} required={required}>
        {label}
      </Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={[
          "w-full rounded-xl border border-gray-200 bg-white/85 px-4 py-3 text-gray-900 outline-none backdrop-blur-md",
          "transition-all duration-200 ease-out hover:bg-white hover:border-blue-200",
          "focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-200/40",
          inputClass ||
          "text-[14px] sm:text-[15px] placeholder:text-[14px] sm:placeholder:text-[15px] placeholder:text-gray-400",
        ].join(" ")}
      />
    </div>
  );
}

/* ✅ Custom animated dropdown (smooth open/close) */
function AnimatedSelect({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    function onDocDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full rounded-xl border border-gray-200 bg-white/85 px-4 py-2 text-left text-[15px] text-gray-900 outline-none backdrop-blur-md sm:text-[16px]",
          "transition-all duration-200 ease-out",
          "hover:bg-white hover:border-blue-200",
          "focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-200/40",
          open ? "border-blue-300 ring-4 ring-blue-200/30 bg-white" : "",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedLabel ? "text-gray-900" : "text-gray-400"}>{selectedLabel || placeholder}</span>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronIcon className={open ? "rotate-180" : ""} />
        </span>
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.10)]",
          "origin-top transition-all duration-200 ease-out",
          open ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 -translate-y-1 scale-[0.98]",
        ].join(" ")}
        role="listbox"
      >
        <div className="max-h-56 overflow-auto py-1">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={[
                  "w-full px-4 py-2 text-left text-[14px] sm:text-[15px]",
                  "transition-colors",
                  active ? "bg-blue-50 text-blue-800" : "text-gray-800 hover:bg-gray-100",
                ].join(" ")}
                role="option"
                aria-selected={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg
      className={["h-4 w-4 text-gray-500 transition-transform duration-200", className].join(" ")}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.2 12.6l1.8 1.8 3.9-4.6"
        stroke="#261CC1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" stroke="#261CC1" strokeWidth="1.4" />
    </svg>
  );
}