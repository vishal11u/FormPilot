"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";

function generateFormId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function FormBuilderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifyEmail, setNotifyEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    
    const form_id = generateFormId();
    const { error: insertError } = await supabase.from("forms").insert([
      {
        form_id,
        user_id: user.id,
        notify_email: notifyEmail,
        redirect_url: redirectUrl || null,
      },
    ]);
    
    setLoading(false);
    if (insertError) setError(insertError.message);
    else router.push("/dashboard");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormPilot
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Builder Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Create Your Lead Generation Form
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Build a form in seconds and start collecting leads immediately. Customize notifications and redirects to fit your workflow.
          </p>
        </div>

        {/* Form Builder */}
        <div className="card p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="space-y-8">
            {/* Form Settings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Form Configuration
              </h2>
              
              <div>
                <label htmlFor="notifyEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notification Email
                </label>
                <input
                  id="notifyEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="input-field"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  You'll receive an email notification every time someone submits this form
                </p>
              </div>

              <div>
                <label htmlFor="redirectUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Redirect URL (Optional)
                </label>
                <input
                  id="redirectUrl"
                  type="url"
                  placeholder="https://yoursite.com/thank-you"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  className="input-field"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Where to redirect users after they submit the form. Leave blank to show a default success message.
                </p>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Form Preview
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input-field bg-white dark:bg-slate-600"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input-field bg-white dark:bg-slate-600"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      className="input-field bg-white dark:bg-slate-600"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      placeholder="Enter your message"
                      rows={3}
                      className="input-field bg-white dark:bg-slate-600 resize-none"
                      disabled
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full"
                    disabled
                  >
                    Submit
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                  This is a preview. Your actual form will be fully functional.
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3 text-base font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating form...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Form & Get Embed Code
                  </>
                )}
              </button>
              
              <Link
                href="/dashboard"
                className="btn-secondary flex-1 py-3 text-base font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Setup</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Create forms in seconds with our streamlined builder
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Easy Integration</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              One-line embed codes for any website or platform
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Smart Analytics</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Track performance and optimize your lead generation
            </p>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
