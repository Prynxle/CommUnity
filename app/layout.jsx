// app/layout.jsx — Root layout wrapper for all routes
// Purpose: Set up global CSS, HTML lang, and dark theme class.
// Why: Centralizes app-wide structure and theming.
import "./globals.css";
import LoadingGate from "../components/shared/LoadingGate";

export const metadata = { title: "Community" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <LoadingGate minDuration={1800}>{children}</LoadingGate>
      </body>
    </html>
  );
}