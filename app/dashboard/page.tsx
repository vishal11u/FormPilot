"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getFormSubmissionUrl } from "../../lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FiMenu,
  FiPlus,
  FiFileText,
  FiZap,
  FiBarChart2,
  FiCopy,
  FiEye,
  FiMail,
  FiExternalLink,
  FiCalendar,
  FiArrowRight,
  FiLogOut,
  FiUser,
  FiInbox,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

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
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getForms = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("forms")
        .select("id, form_id, notify_email, redirect_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setForms(data);
        const formIds = data.map((f) => f.form_id);
        if (formIds.length > 0) {
          const { count } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .in("form_id", formIds);
          setTotalSubmissions(count || 0);
        } else {
          setTotalSubmissions(0);
        }
      }
      setLoading(false);
    };

    getForms();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const copyToClipboard = (text: string, formId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          {/* Modern Navigation */}
          <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => router.push("/")}
                >
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/submissions"
                    className="flex items-center space-x-2 text-indigo-600 hover:text-gray-700 transition-colors font-medium"
                  >
                    <span>Submissions</span>
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-indigo-600 hover:text-gray-700 transition-colors font-medium"
                  >
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-gray-700 transition-colors font-medium"
                  >
                    <span>Logout</span>
                  </button>
                  <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold shadow-md">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                    <p className="text-xs text-slate-500">Admin</p>
                  </div>
                </div>
                <ThemeToggle />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-slate-600 hover:text-slate-900 p-2"
                >
                  <FiMenu className="text-2xl" />
                </button>
              </div>

              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <div className="px-4 py-3 bg-indigo-50 rounded-lg mb-3">
                      <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                      <p className="text-xs text-slate-500">Admin Account</p>
                    </div>
                    <Link
                      href="/submissions"
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <FiInbox className="text-xl" />
                      <span className="font-medium">Submissions</span>
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <FiUser className="text-xl" />
                      <span className="font-medium">Account</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                    >
                      <FiLogOut className="text-xl" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back! 👋</h1>
                  <p className="text-slate-600 text-lg">
                    Here's what's happening with your forms today
                  </p>
                </div>
                <Link
                  href="/form-builder"
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  <FiPlus className="text-xl" />
                  <span>Create New Form</span>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FiFileText className="text-indigo-600 text-xl" />
                    </div>
                    <div className="px-3 py-1 bg-indigo-50 rounded-full">
                      <span className="text-xs font-semibold text-indigo-600">Active</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{forms.length}</h3>
                  <p className="text-slate-600 font-medium">Total Forms</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">All forms are active</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FiZap className="text-emerald-600 text-xl" />
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 rounded-full">
                      <span className="text-xs font-semibold text-emerald-600">Live</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{forms.length}</h3>
                  <p className="text-slate-600 font-medium">Active Forms</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Ready to collect leads</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FiBarChart2 className="text-purple-600 text-xl" />
                    </div>
                    <div className="px-3 py-1 bg-purple-50 rounded-full">
                      <span className="text-xs font-semibold text-purple-600">Total</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalSubmissions}</h3>
                  <p className="text-slate-600 font-medium">Total Submissions</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Across all forms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms Section */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Forms</h2>
                    <p className="text-slate-600 mt-1">
                      {forms.length} form{forms.length !== 1 ? "s" : ""} ready to collect leads
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {forms.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FiFileText className="text-4xl text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No forms yet</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      Create your first form to start collecting leads and growing your business
                    </p>
                    <Link
                      href="/form-builder"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                      <FiPlus className="text-xl" />
                      <span>Create Your First Form</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forms.map((form) => (
                      <div
                        key={form.id}
                        className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-indigo-200 bg-gradient-to-br from-white to-slate-50"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          {/* Form Info */}
                          <div className="flex-1">
                            <div className="flex items-start space-x-4 mb-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <FiFileText className="text-white text-2xl" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                  {form.form_id}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                  <FiCalendar className="text-base" />
                                  <span>
                                    Created{" "}
                                    {new Date(form.created_at).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="px-4 py-2 bg-emerald-50 rounded-lg">
                                <p className="text-xs font-semibold text-emerald-600">ACTIVE</p>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-100">
                                <FiMail className="text-indigo-600 text-xl mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                    Notification Email
                                  </p>
                                  <p className="text-sm text-slate-900 font-medium break-all">
                                    {form.notify_email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-100">
                                <FiExternalLink className="text-purple-600 text-xl mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                    Redirect URL
                                  </p>
                                  <p className="text-sm text-slate-900 font-medium break-all">
                                    {form.redirect_url || (
                                      <span className="text-slate-400 italic">Not set</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* View Details Link */}
                            <Link
                              href={`/form/${form.form_id}`}
                              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              <span>View Form Details</span>
                              <FiArrowRight />
                            </Link>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-3 lg:w-64">
                            <Link
                              href={`/form/${form.form_id}`}
                              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            >
                              <FiEye className="text-lg" />
                              <span>View Details</span>
                              <FiArrowRight className="text-lg" />
                            </Link>

                            <button
                              onClick={() => {
                                const embedCode = `<form action="${getFormSubmissionUrl(form.form_id)}" method="POST">
  <input name="name" placeholder="Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="mobile" placeholder="Mobile" />
  <textarea name="remark" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`;
                                copyToClipboard(embedCode, form.id);
                              }}
                              className="flex items-center justify-center space-x-2 bg-white text-slate-700 border-2 border-slate-200 px-5 py-3 rounded-xl font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                            >
                              <FiCopy className="text-lg" />
                              <span>{copiedId === form.id ? "Copied!" : "Copy Embed Code"}</span>
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
                                if (newWindow) {
                                  newWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>Embed Code - ${form.form_id}</title>
                                        <style>
                                          body { font-family: system-ui; padding: 40px; background: #f8fafc; }
                                          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                          h2 { color: #1e293b; margin-bottom: 8px; }
                                          .subtitle { color: #64748b; margin-bottom: 24px; }
                                          pre { background: #1e293b; color: #e2e8f0; padding: 24px; border-radius: 12px; overflow-x: auto; line-height: 1.6; }
                                          .copy-btn { background: linear-gradient(to right, #4f46e5, #7c3aed); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 16px; }
                                          .copy-btn:hover { opacity: 0.9; }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="container">
                                          <h2>Embed Code</h2>
                                          <p class="subtitle">Form ID: ${form.form_id}</p>
                                          <p>Copy this code and paste it into your website:</p>
                                          <pre id="code">${embedCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                                          <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('code').textContent); this.textContent='Copied!'">Copy to Clipboard</button>
                                        </div>
                                      </body>
                                    </html>
                                  `);
                                }
                              }}
                              className="flex items-center justify-center space-x-2 bg-white text-slate-700 border-2 border-slate-200 px-5 py-3 rounded-xl font-semibold hover:border-purple-300 hover:bg-purple-50 transition-all"
                            >
                              <FiEye className="text-lg" />
                              <span>View Code</span>
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
        </div>
      )}
    </ProtectedRoute>
  );
}
