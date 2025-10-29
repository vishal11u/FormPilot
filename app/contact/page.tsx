"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const { error } = await supabase.from("contacts").insert([form]);

    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
      setTimeout(() => {
        router.push("/");
      }, 3000);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors">
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
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {status === "sent" ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl text-center shadow-sm">
            <p className="text-green-700 dark:text-green-400 font-medium">
              ✅ Thanks! We’ve received your message and will get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl space-y-5 transition-all duration-300"
          >
            {/* Name */}
            <div className="flex items-center space-x-3 justify-center">
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                placeholder="What's it about?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white resize-none"
                rows={5}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                status === "sending"
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                ❌ Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
