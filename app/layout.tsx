import { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FormPilot - Form Submission SaaS Platform",
  description:
    "FormPilot is a SaaS platform to create, manage, and analyze form submissions easily.",
  keywords: ["FormPilot", "form builder", "SaaS platform", "form submissions", "no-code forms"],
  authors: [{ name: "FormPilot Team" }],
  openGraph: {
    title: "FormPilot - Form Submission SaaS Platform",
    description: "Build and manage forms effortlessly with FormPilot.",
    url: "https://www.formpilot.com",
    siteName: "FormPilot",
    images: [
      {
        url: "https://www.formpilot.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FormPilot SaaS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FormPilot - Form Submission SaaS Platform",
    description: "Easily create, share, and manage forms with FormPilot.",
    images: ["https://www.formpilot.com/og-image.png"],
    creator: "@formpilot",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.formpilot.com/" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "var(--background)",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 32px",
            marginBottom: 32,
            borderRadius: "0 0 16px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(27,42,111,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link
              href="/dashboard"
              style={{ color: "var(--foreground)", fontWeight: 500, fontSize: 18, marginRight: 16 }}
            >
              Dashboard
            </Link>
            <Link
              href="/form-builder"
              style={{ color: "var(--foreground)", fontWeight: 500, fontSize: 18, marginRight: 16 }}
            >
              Form Builder
            </Link>
            <Link
              href="/login"
              style={{ color: "var(--foreground)", fontWeight: 500, fontSize: 18, marginRight: 16 }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              style={{ color: "var(--foreground)", fontWeight: 500, fontSize: 18 }}
            >
              Signup
            </Link>
          </div>
          <button
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              borderRadius: 9999,
              padding: "8px 20px",
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            aria-label="Toggle dark mode"
          >
            🌓
          </button>
        </nav>
        {children}
      </body>
    </html>
  );
}
