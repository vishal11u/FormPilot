"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16" onClick={() => router.push("/")}>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FormPilot
                </span>
                <p className="text-xs text-slate-500">Lead Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="md:flex hidden items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Home
              </Link>

              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Terms & Conditions
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          By using FormPilot, you agree to the following terms.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Use of Service
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Do not abuse, reverse engineer, or violate laws using the service.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Accounts
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          You are responsible for activity under your account and keeping credentials safe.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Liability
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          FormPilot is provided "as is" without warranties; liability is limited.
        </p>
      </div>
    </div>
  );
}
