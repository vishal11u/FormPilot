import { Metadata } from "next";
import "./globals.css";


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
        {children}
      </body>
    </html>
  );
}
