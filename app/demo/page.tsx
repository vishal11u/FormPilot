"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    remark: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className=" rounded-lg shadow-xl p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Thank you!</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your message has been submitted successfully. We'll get back to you soon!
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-primary w-full">
              Submit Another Message
            </button>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
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
              <Link
                href="/login"
                className="md:flex hidden items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                See FormPilot in
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Action
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Experience the power of our lead generation forms. This demo shows exactly how your
                forms will look and function when embedded on your website.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">
                  Professional design that converts
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">
                  Instant email notifications
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">Mobile-responsive design</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">Dynamic domain support</span>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Building Your Forms
              </Link>
            </div>
          </div>

          {/* Right Side - Demo Form */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className=" shadow-lg rounded-xl p-8 bg-white dark:bg-slate-800/80 backdrop-blur-s">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Contact Us
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Get in touch and we'll respond as soon as possible
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3.5 text-sm rounded-lg bg-gray-800 text-white dark:bg-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3.5 text-sm rounded-lg bg-gray-800 text-white dark:bg-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full p-3.5 text-sm rounded-lg bg-gray-800 text-white dark:bg-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="remark"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="remark"
                    name="remark"
                    rows={4}
                    placeholder="Tell us about your project or inquiry..."
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="w-full p-3.5 text-sm rounded-lg bg-gray-800 text-white dark:bg-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-base font-semibold">
                  Send Message
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This is a demo form. In production, submissions would be sent to your email and
                  stored in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose FormPilot?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Professional forms that look great and work perfectly on every device
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 shadow-lg rounded-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Mobile First
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Every form is optimized for mobile devices, ensuring the best user experience across
                all screen sizes.
              </p>
            </div>

            <div className="text-center bg-white p-6 shadow-lg rounded-lg">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Instant Notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get notified immediately when someone submits a form, so you never miss a potential
                lead.
              </p>
            </div>

            <div className="text-center bg-white p-6 shadow-lg rounded-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                High Conversion
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Beautiful, professional forms that increase your conversion rates and capture more
                qualified leads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
