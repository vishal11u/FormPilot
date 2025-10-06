"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>
        {status === "sent" ? (
          <div className="card p-6">
            <p className="text-green-600 dark:text-green-400">
              Thanks! We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card p-6 space-y-4">
            <input className="input-field" placeholder="Your name" required />
            <input className="input-field" type="email" placeholder="Your email" required />
            <textarea className="input-field resize-none" rows={5} placeholder="How can we help?" />
            <button className="btn-primary" type="submit">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
