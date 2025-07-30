import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "FormPilot",
  description: "Form submission SaaS platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
