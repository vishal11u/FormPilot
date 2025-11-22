"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../lib/authContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { getFormSubmissionUrl } from "../../../lib/utils";
import {
  FiArrowLeft,
  FiCopy,
  FiSettings,
  FiMail,
  FiExternalLink,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiFileText,
  FiInbox,
  FiUser,
  FiLogOut,
  FiMenu,
  FiGlobe,
  FiPieChart,
  FiActivity,
} from "react-icons/fi";
import { CiSettings } from "react-icons/ci";

interface Form {
  id: string;
  form_id: string;
  notify_email: string;
  redirect_url: string | null;
  created_at: string;
}

interface Submission {
  id: string;
  created_at: string;
}

export default function FormOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formId = params.id as string;

  useEffect(() => {
    const fetchFormData = async () => {
      if (!user || !formId) return;

      const { data: formData } = await supabase
        .from("forms")
        .select("*")
        .eq("form_id", formId)
        .eq("user_id", user.id)
        .single();

      if (formData) setForm(formData);

      const { data: submissionsData } = await supabase
        .from("submissions")
        .select("id, created_at")
        .eq("form_id", formId)
        .order("created_at", { ascending: false });

      if (submissionsData) setSubmissions(submissionsData);
      setLoading(false);
    };

    fetchFormData();
  }, [user, formId]);

  const totalSubmissions = submissions.length;
  const monthlySubmissions = submissions.filter((sub) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(sub.created_at) >= thirtyDaysAgo;
  }).length;

  const weeklySubmissions = submissions.filter((sub) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(sub.created_at) >= sevenDaysAgo;
  }).length;

  const handleCopyEndpoint = () => {
    const endpoint = getFormSubmissionUrl(formId);
    navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading form details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!form) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiFileText className="text-4xl text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Form not found</h1>
            <p className="text-slate-600 mb-6">
              This form doesn't exist or you don't have access to it.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <FiArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiFileText className="text-white text-xl" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    FormPilot
                  </span>
                  <p className="text-xs text-slate-500">Lead Management</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/submissions"
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  <span>Submissions</span>
                </Link>

                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors font-medium"
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

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-slate-900 p-2"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>

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
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                <FiArrowLeft className="text-lg" />
                <span>Back to Dashboard</span>
              </Link>

              <Link
                href={`/form/${formId}/settings`}
                className="inline-flex items-center space-x-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium"
              >
                <CiSettings size={22} />
                <span>Settings</span>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FiFileText className="text-2xl" />
                    <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wide">
                      Form Overview
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{form.form_id}</h1>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <FiCalendar className="text-lg" />
                    <span>
                      Created{" "}
                      {new Date(form.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                    🟢 Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="text-indigo-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalSubmissions}</h3>
                <p className="text-slate-600 font-medium text-sm">Total Submissions</p>
                <p className="text-xs text-slate-400 mt-1">All time</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="text-emerald-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{monthlySubmissions}</h3>
                <p className="text-slate-600 font-medium text-sm">This Month</p>
                <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiActivity className="text-purple-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{weeklySubmissions}</h3>
                <p className="text-slate-600 font-medium text-sm">This Week</p>
                <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FiPieChart className="text-amber-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                  {totalSubmissions > 0
                    ? Math.round((monthlySubmissions / totalSubmissions) * 100)
                    : 0}
                  %
                </h3>
                <p className="text-slate-600 font-medium text-sm">Recent Activity</p>
                <p className="text-xs text-slate-400 mt-1">Monthly/Total ratio</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submissions Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Submissions</h3>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Last 30 Days
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Inbox</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">
                      {monthlySubmissions}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <span className="text-sm text-slate-600">Spam</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">0</span>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center border border-indigo-100">
                  <div className="text-center">
                    <FiBarChart2 className="text-4xl text-indigo-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Chart visualization</p>
                  </div>
                </div>
              </div>

              {/* Country Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">By Country</h3>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Last 30 Days
                  </span>
                </div>
                <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center border border-emerald-100">
                  <div className="text-center">
                    <FiGlobe className="text-4xl text-emerald-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Geographic data</p>
                  </div>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Status</h3>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Last 15 Days
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Success</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">
                      {totalSubmissions}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Error</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Pending</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">0</span>
                  </div>
                </div>
                <div className="h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border border-purple-100">
                  <div className="text-center">
                    <FiPieChart className="text-4xl text-purple-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Status chart</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiSettings className="text-indigo-600 text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Configuration</h2>
                </div>
                <Link
                  href={`/form/${formId}/settings`}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FiSettings />
                  <span>Edit Settings</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FiMail className="text-indigo-600 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">
                      Notification Email
                    </p>
                    <p className="text-sm text-slate-900 font-medium break-all">
                      {form.notify_email}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Receives all form submissions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FiExternalLink className="text-purple-600 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                      Redirect URL
                    </p>
                    <p className="text-sm text-slate-900 font-medium break-all">
                      {form.redirect_url || (
                        <span className="text-slate-400 italic">Not configured</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Post-submission redirect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FiFileText className="text-emerald-600 text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Integration Endpoint</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Form Submission URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={getFormSubmissionUrl(formId)}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm font-mono pr-12"
                      />
                      <FiCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                    </div>
                    <button
                      onClick={handleCopyEndpoint}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      {copied ? (
                        <>
                          <FiCheckCircle className="text-lg" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="text-lg" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 flex items-start space-x-2">
                    <span className="text-indigo-600">💡</span>
                    <span>
                      Use this URL as the action attribute in your HTML form to start receiving
                      submissions instantly.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
