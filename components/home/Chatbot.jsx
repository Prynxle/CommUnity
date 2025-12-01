"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm MARI, your Marikina Heights virtual assistant. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const scrollRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input };
    const newBotMessage = {
      sender: "bot",
      text: `I received: ${input}`,
    };

    setMessages((prev) => [...prev, newUserMessage, newBotMessage]);
    setInput("");
  };

  // Auto scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold hover:bg-orange-600 transition z-50"
        >
          Ask MARI
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] md:w-[380px] h-[520px] bg-[#0D0D0D] text-white rounded-2xl shadow-2xl border border-[#1e1e1e] flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#121212] border-b border-[#2c2c2c]">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center">
                <Image src="/LOGO1.png" alt="MARI" width={28} height={28} />
              </div>
              <h2 className="font-bold text-sm">MARI – Virtual Assistant</h2>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-[#111]"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words whitespace-pre-wrap ${
                  msg.sender === "bot"
                    ? "bg-[#1A1A1A] text-white self-start rounded-tl-none"
                    : "bg-orange-500 text-black self-end rounded-tr-none ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#101010] border-t border-[#2c2c2c] flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-[#0B0B0B] border border-[#2c2c2c] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-orange-500 transition"
            />

            <button
              onClick={sendMessage}
              className="bg-orange-500 px-4 py-2 rounded-xl text-black font-medium hover:bg-orange-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
