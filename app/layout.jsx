// app/layout.jsx
/* eslint-disable react-refresh/only-export-components */
import "./globals.css";
import LoadingGate from "../components/shared/LoadingGate";

export const metadata = { title: "Community" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-white text-gray-900">
        <LoadingGate minDuration={1800}>{children}</LoadingGate>
      </body>
    </html>
  );
}