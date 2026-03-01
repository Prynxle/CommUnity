"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiMessageCircle, FiX, FiAlertTriangle } from "react-icons/fi";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m MARI — your school virtual assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // ✅ Pre-empted questions: Emergency + Website FAQs
  const quickActions = useMemo(
    () => [
      {
        label: "Emergency: Campus Security",
        text: "Emergency: I need campus security assistance.",
        kind: "emergency",
      },
      {
        label: "Emergency: Clinic / Nurse",
        text: "Emergency: I need the clinic/nurse hotline.",
        kind: "emergency",
      },
      { label: "How do I submit a report?", text: "How do I submit a report?", kind: "faq" },
      { label: "How do I track my report?", text: "How do I track my report?", kind: "faq" },
      { label: "Can I report anonymously?", text: "Can I report anonymously?", kind: "faq" },
      { label: "What details should I include?", text: "What details should I include in a report?", kind: "faq" },
      { label: "Where is the emergency button?", text: "Where is the emergency button?", kind: "faq" },
      { label: "Who sees my report?", text: "Who can see my report?", kind: "faq" },
    ],
    []
  );

  function fakeBotReply(userText) {
    const t = userText.toLowerCase();

    if (
      t.includes("emergency") ||
      t.includes("security") ||
      t.includes("clinic") ||
      t.includes("nurse") ||
      t.includes("hotline")
    ) {
      return (
        "If this is urgent:\n" +
        "• Campus Security: 0949-673-3019\n" +
        "• Campus Clinic/Nurse: 0942-0055\n" +
        "• National Emergency: 161\n\n" +
        "If someone is in immediate danger, call 161 first.\n" +
        "Want me to show the full campus hotline directory?"
      );
    }

    if (t.includes("submit") || (t.includes("report") && !t.includes("track"))) {
      return (
        "To submit a report:\n" +
        "1) Click “Create a Report”\n" +
        "2) Choose Category + Location\n" +
        "3) Describe what happened (include when/where)\n" +
        "4) Add evidence (optional)\n" +
        "5) Submit\n\n" +
        "Tip: Clear details help the right office respond faster."
      );
    }

    if (t.includes("track")) {
      return (
        "To track your report:\n" +
        "1) Go to the “Track” page\n" +
        "2) Enter your reference/ID\n" +
        "3) View status updates and actions\n\n" +
        "If you don’t have your ID, check your confirmation message/email."
      );
    }

    if (t.includes("anonymous")) {
      return (
        "If anonymous reporting is enabled by your school, you’ll see an “Anonymous” option when submitting.\n" +
        "If it’s not visible, it may be disabled by the admin."
      );
    }

    if (t.includes("details") || t.includes("include")) {
      return (
        "Include:\n" +
        "• What happened\n" +
        "• Date/time (approx. is okay)\n" +
        "• Location (floor/room/area)\n" +
        "• Who was involved (if known)\n" +
        "• Evidence (optional)\n\n" +
        "Avoid posting sensitive info publicly—use the report form instead."
      );
    }

    if (t.includes("emergency button") || t.includes("where is the emergency")) {
      return "You can use the “Emergency” button in the header (top navigation). It’s meant for quick access to urgent hotlines and help.";
    }

    if (t.includes("who sees") || t.includes("privacy") || t.includes("confidential")) {
      return (
        "Reports are typically visible only to authorized school personnel (e.g., guidance/admin/security) depending on category.\n" +
        "If your school supports anonymous reports, your identity won’t be shown to reviewers."
      );
    }

    return `Got it — I received: “${userText}”. (Connect me to your backend later and I’ll answer like a real assistant.)`;
  }

  const sendMessage = (overrideText) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) return;

    const newUserMessage = { sender: "user", text: textToSend };
    const newBotMessage = { sender: "bot", text: fakeBotReply(textToSend) };

    setMessages((prev) => [...prev, newUserMessage, newBotMessage]);
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={[
            "fixed bottom-6 right-6 z-[9999] pointer-events-auto",
            "group grid place-items-center",
            "h-14 w-14 rounded-full",
            "bg-gradient-to-b from-[#2F5BFF] to-[#261CC1]",
            "text-white",
            "shadow-[0_18px_55px_rgba(38,28,193,0.22)]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(38,28,193,0.30)]",
            "active:translate-y-0",
          ].join(" ")}
          aria-label="Open MARI chatbot"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {isOpen && (
        <div
          className={[
            "fixed bottom-6 right-6 z-[9999] pointer-events-auto",
            "w-[360px] sm:w-[400px] h-[560px]",
            "rounded-3xl bg-white",
            "shadow-[0_24px_80px_rgba(38,28,193,0.22)]",
            "overflow-hidden flex flex-col",
          ].join(" ")}
          role="dialog"
          aria-label="MARI chatbot"
        >
          <div className="relative">
            <div className="relative flex items-center justify-between gap-3 px-4 py-4 border-b border-white/10 bg-[#1C0770]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-16 w-16 place-items-center">
                  <Image
                    src="/olopsclogo.png"
                    alt="OLOPSC Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="min-w-0 leading-tight">
                  <div className="text-[18px] font-extrabold tracking-wide text-white truncate">
                    OLOPSC Chatbot
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className={[
                  "shrink-0 inline-flex items-center justify-center",
                  "h-10 w-10 rounded-2xl",
                  "text-white",
                  "transition hover:opacity-80",
                ].join(" ")}
                aria-label="Close chatbot"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-[12.5px] font-semibold text-gray-700">Quick questions</div>
              <span className="rounded-full border border-blue-200 bg-[#261CC1]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1a138f]">
                Tap to ask
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  className={[
                    "group inline-flex items-center gap-2",
                    "rounded-full border border-blue-200 bg-white",
                    "px-3 py-2",
                    "text-[12.5px] font-semibold",
                    q.kind === "emergency" ? "text-red-700" : "text-[#1C0770]",
                    "shadow-[0_10px_28px_rgba(38,28,193,0.08)]",
                    "transition hover:-translate-y-0.5 hover:bg-[#261CC1]/[0.06]",
                  ].join(" ")}
                >
                  <span
                    className={["h-2 w-2 rounded-full", q.kind === "emergency" ? "bg-red-500" : "bg-[#2F5BFF]"].join(
                      " "
                    )}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{q.label}</span>
                  <span className="opacity-70 group-hover:opacity-100 transition" aria-hidden="true">
                    <FiArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
              <span className="mt-[2px] text-red-600">
                <FiAlertTriangle />
              </span>
              <p className="text-[12px] text-red-700 leading-snug">
                For immediate danger, call <span className="font-semibold">161</span> or Campus Security.
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="mt-4 flex-1 overflow-hidden px-4 pb-4">
            <div
              ref={scrollRef}
              className={[
                "h-full overflow-y-auto pr-2 space-y-3",
                "scrollbar-thin scrollbar-thumb-[#cfd7ff] scrollbar-track-transparent",
              ].join(" ")}
            >
              {messages.map((msg, index) => {
                const isBot = msg.sender === "bot";
                return (
                  <div key={index} className={isBot ? "flex" : "flex justify-end"}>
                    <div
                      className={[
                        "max-w-[84%] rounded-2xl px-4 py-3 text-[14px] sm:text-[14.5px] leading-relaxed whitespace-pre-wrap",
                        isBot
                          ? "border border-blue-200 bg-white text-gray-800 shadow-[0_12px_30px_rgba(38,28,193,0.08)]"
                          : "border border-blue-200 bg-gradient-to-b from-[#2F5BFF] to-[#261CC1] text-white shadow-[0_14px_38px_rgba(38,28,193,0.18)]",
                        isBot ? "rounded-tl-md" : "rounded-tr-md",
                      ].join(" ")}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-blue-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                type="text"
                placeholder="Type your message…"
                className={[
                  "flex-1 h-11 rounded-2xl px-4",
                  "border border-blue-200 bg-white",
                  "text-[14px] text-gray-900",
                  "outline-none transition",
                  "focus:border-blue-300 focus:ring-4 focus:ring-blue-200/40",
                ].join(" ")}
              />

              <button
                onClick={() => sendMessage()}
                className={[
                  "group inline-flex items-center justify-center gap-2",
                  "h-11 rounded-2xl px-4",
                  "border border-blue-600",
                  "bg-gradient-to-b from-[#2F5BFF] to-[#261CC1]",
                  "text-[14px] font-semibold text-white",
                  "shadow-[0_16px_40px_rgba(38,28,193,0.20)]",
                  "transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(38,28,193,0.26)]",
                ].join(" ")}
              >
                Send
                <span className="opacity-85 group-hover:opacity-100 transition" aria-hidden="true">
                  <FiArrowRight size={15} />
                </span>
              </button>
            </div>

            <p className="mt-2 text-[12px] text-gray-500">
              For urgent danger: call <span className="font-semibold text-gray-700">161</span> or Campus Security.
            </p>
          </div>
        </div>
      )}
    </>
  );
}