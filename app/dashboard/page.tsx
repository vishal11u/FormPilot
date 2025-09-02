"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getFormSubmissionUrl } from "../../lib/utils";

interface Form {
  id: string;
  form_id: string;
  notify_email: string;
  redirect_url: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForms = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("forms")
        .select("id, form_id, notify_email, redirect_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (!error && data) setForms(data);
      setLoading(false);
    };
    
    getForms();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
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
              <span className="text-slate-600 dark:text-slate-300 text-sm">
                Welcome, {user?.email}
              </span>
              <Link href="/submissions" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                Submissions
              </Link>
              <Link href="/account" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                Account
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your forms and track your lead generation performance
              </p>
            </div>
            <Link
              href="/form-builder"
              className="btn-primary mt-4 sm:mt-0"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Form
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Forms</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{forms.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Forms</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{forms.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Submissions</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Forms</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {forms.length} form{forms.length !== 1 ? 's' : ''}
            </div>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No forms yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create your first form to start collecting leads
              </p>
              <Link href="/form-builder" className="btn-primary">
                Create Your First Form
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div key={form.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">Form ID: {form.form_id}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Created {new Date(form.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Notify Email:</span>
                          <p className="text-slate-600 dark:text-slate-400">{form.notify_email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Redirect URL:</span>
                          <p className="text-slate-600 dark:text-slate-400">
                            {form.redirect_url || "None"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Link
                          href={`/form/${form.form_id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          View Form Details →
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                                             <button
                         onClick={() => {
                           const embedCode = `<form action="${getFormSubmissionUrl(form.form_id)}" method="POST">
  <input name="name" placeholder="Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="mobile" placeholder="Mobile" />
  <textarea name="remark" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`;
                           navigator.clipboard.writeText(embedCode);
                           alert('Embed code copied to clipboard!');
                         }}
                         className="btn-secondary text-sm px-4 py-2"
                       >
                         Copy Embed Code
                       </button>
                      
                                              <button
                          onClick={() => {
                            const embedCode = `<form action="${getFormSubmissionUrl(form.form_id)}" method="POST">
  <input name="name" placeholder="Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="mobile" placeholder="Mobile" />
  <textarea name="remark" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`;
                          const newWindow = window.open();
                          newWindow?.document.write(`
                            <html>
                              <head><title>Embed Code for ${form.form_id}</title></head>
                              <body style="font-family: monospace; padding: 20px; background: #f5f5f5;">
                                <h2>Embed Code for Form: ${form.form_id}</h2>
                                <p>Copy this code and paste it into your website:</p>
                                <pre style="background: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; overflow-x: auto;">${embedCode}</pre>
                              </body>
                            </html>
                          `);
                        }}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        View Embed Code
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
