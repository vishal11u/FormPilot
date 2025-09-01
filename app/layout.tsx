import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "FormPilot - Lead Generation SaaS Platform",
  description: "Create beautiful forms, capture leads, and grow your business with FormPilot's powerful lead generation platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
