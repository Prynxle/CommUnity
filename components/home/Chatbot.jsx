"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiMessageCircle, FiX, FiAlertTriangle } from "react-icons/fi";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

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

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your campus assistant. How can I help you today?",
      buttons: quickActions,
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);


  function generateFollowUpButtons(userText) {
    const t = userText.toLowerCase();

    if (t.includes("emergency") || t.includes("security") || t.includes("clinic")) {
      return [
        { label: "Show full hotline list", text: "Show me the full campus hotline directory." },
        { label: "How do I submit a report?", text: "How do I submit a report?" },
      ];
    }

    if (t.includes("submit") || t.includes("report") && !t.includes("track")) {
      return [
        { label: "What details should I include?", text: "What details should I include in a report?" },
        { label: "Can I report anonymously?", text: "Can I report anonymously?" },
      ];
    }

    if (t.includes("track")) {
      return [
        { label: "How do I submit a report?", text: "How do I submit a report?" },
        { label: "Emergency contacts", text: "What are the emergency contact numbers?" },
      ];
    }

    // Default follow-up buttons
    return quickActions.slice(0, 2).map((q) => ({ label: q.label, text: q.text }));
  }

  const sendMessage = async (overrideText) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) return;

    const newUserMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    try {
      // Call RAG API
      const res = await fetch("/api/chat/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      if (res.ok && data.text) {
        const newBotMessage = {
          sender: "bot",
          text: data.text,
          buttons: generateFollowUpButtons(textToSend), // Keep some interactive buttons
        };
        setMessages((prev) => [...prev, newBotMessage]);
      } else {
        // Fallback to basic response if RAG fails
        const fallbackMessage = {
          sender: "bot",
          text: "I'm here to help with school reports and emergencies. What would you like to know?",
          buttons: quickActions.slice(0, 3).map((q) => ({ label: q.label, text: q.text })),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      // Fallback response
      const fallbackMessage = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again or contact campus support.",
        buttons: [],
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    }
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
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto",
            "group grid place-items-center",
            "h-14 w-14 rounded-full",
            "bg-gradient-to-b from-[#2F5BFF] to-[#261CC1]",
            "text-white",
            "shadow-[0_18px_55px_rgba(38,28,193,0.22)]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(38,28,193,0.30)]",
            "active:translate-y-0",
          ].join(" ")}
          aria-label="Open campus assistant chat"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {isOpen && (
        <div
          className={[
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto",
            "w-[calc(100vw-2rem)] max-w-[400px] sm:w-[400px] h-[min(560px,85vh)]",
            "rounded-3xl bg-white",
            "shadow-[0_24px_80px_rgba(38,28,193,0.22)]",
            "overflow-hidden flex flex-col",
          ].join(" ")}
          role="dialog"
          aria-label="Campus assistant chat"
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
                    Campus Assistant
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

          {/* Messages (chat bubbles) */}
          <div className="flex-1 overflow-hidden px-4 pb-4">
            <div
              ref={scrollRef}
              className={[
                "h-full overflow-y-auto pr-2 space-y-3 py-3 bg-[#F7F9FF]",
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
                      {isBot && msg.buttons && msg.buttons.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.buttons.map((btn, i) => (
                            <button
                              type="button"
                              key={i}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                sendMessage(btn.text);
                              }}
                              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#1C0770] hover:bg-blue-100"
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}
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