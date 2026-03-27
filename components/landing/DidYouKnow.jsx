"use client";

import { encodesans, inter } from "../../lib/fonts";

export default function DidYouKnow() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute -left-64 top-14 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute right-[-220px] top-8 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute left-1/2 top-32 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/18 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-5 py-2 text-xs font-semibold tracking-[0.28em] text-[#1a138f] shadow-sm">
            REPORT • TRACK • RESOLVE
          </span>

          <h2
            className={`${encodesans.className} mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900`}
          >
            Built for faster campus response
          </h2>

          <p className={`${inter.className} mx-auto mt-3 max-w-3xl text-sm sm:text-base leading-7 text-slate-600`}>
            CommUnity helps you submit a concern in minutes and follow its progress using a single
            reference: your Report ID.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">DID YOU KNOW?</p>
                <h3 className={`${encodesans.className} mt-2 text-xl font-semibold text-slate-900`}>
                  Your Report ID is your tracker
                </h3>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#261CC1]/10 text-[#1a138f] font-bold">
                ID
              </span>
            </div>

            <p className={`${inter.className} mt-3 text-sm leading-7 text-slate-600`}>
              After submitting, save your Report ID. You can use it to check status updates and the
              report timeline anytime.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">GOOD PRACTICE</p>
                <h3 className={`${encodesans.className} mt-2 text-xl font-semibold text-slate-900`}>
                  Emergencies should be called in
                </h3>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFEB00]/40 text-slate-900 font-bold">
                !
              </span>
            </div>

            <p className={`${inter.className} mt-3 text-sm leading-7 text-slate-600`}>
              For immediate danger, call the emergency hotline first. Then submit a report for
              documentation and follow-up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
