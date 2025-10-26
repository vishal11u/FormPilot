import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/authContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "FormPilot - Form Submission SaaS Platform",
  description:
    "FormPilot is a SaaS platform to create, manage, and analyze form submissions easily.",
  keywords: ["FormPilot", "form builder", "SaaS platform", "form submissions", "no-code forms"],
  authors: [{ name: "FormPilot Team" }],
  openGraph: {
    title: "FormPilot - Form Submission SaaS Platform",
    description: "Build and manage forms effortlessly with FormPilot.",
    url: "https://form-pilot-v.vercel.app/",
    siteName: "FormPilot",
    images: [
      {
        url: "https://form-pilot-v.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FormPilot SaaS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://form-pilot-v.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <ClerkProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
