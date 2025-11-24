"use client";

import { useState } from "react";
import { encodesans, inter } from "../../lib/fonts";

const faqs = [
  {
    question: "How can I track my report?",
    answer:
      "A monitoring function integrated into the proposed system allows residents to track the progress of their submitted reports. Upon filing a report, the system automatically generates a unique reference number. By entering this number, residents can view the current status of their report, including whether it has been acknowledged, assigned to the appropriate official, or resolved. This monitoring system ensures that residents are informed about the progress of their reports, thereby promoting accountability and transparency.",
  },
  {
    question: "What kind of issues can I report?",
    answer:
      "All existing community concerns.",
  },
  {
    question: "How do I use the AI?",
    answer:
      "You can use the AI by simply typing your request or concern about documents, and it will automatically guide you through the right process or document you need.",
  },
  {
    question: "Can my report be resolved immediately?",
    answer:
      "Not all reports are resolved instantly, but you’ll receive updates as soon as the Barangay takes action on your concern.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-black text-white">

      {/* HEADING */}
      <h2
        className={`${encodesans.className} text-center text-5xl md:text-5xl font-bold mb-16`}
        style={{ color: "#FFA629" }}
      >
        Frequently Asked Questions (FAQs)
      </h2>

      {/* FAQ LIST */}
      <div className="max-w-3xl mx-auto space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`
                border border-orange-500 rounded-xl px-6 py-4 cursor-pointer
                transition-all duration-300
                ${isOpen ? "bg-[#1a1a1a]" : "bg-transparent"}
              `}
              onClick={() => toggleFAQ(index)}
            >
              {/* QUESTION ROW */}
              <div className="flex justify-between items-center">
                <p
                  className={`${inter.className} text-lg md:text-lg`}
                >
                  {index + 1}. {faq.question}
                </p>

                {/* ICON: + becomes X */}
                <span className="text-2xl font-bold text-orange-400">
                  {isOpen ? "×" : "+"}
                </span>
              </div>

              {/* SMOOTH ANIMATED ANSWER */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}
                `}
              >
                <p
                  className={`${inter.className} text-gray-300 text-[15px] leading-relaxed pb-2`}
                >
                  {faq.answer}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
