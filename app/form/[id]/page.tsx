"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../lib/authContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getFormSubmissionUrl } from "../../../lib/utils";

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
  const { user } = useAuth();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const formId = params.id as string;

  useEffect(() => {
    const fetchFormData = async () => {
      if (!user || !formId) return;
      
      // Fetch form details
      const { data: formData } = await supabase
        .from("forms")
        .select("*")
        .eq("form_id", formId)
        .eq("user_id", user.id)
        .single();
      
      if (formData) setForm(formData);
      
      // Fetch submissions for this form
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

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const monthlySubmissions = submissions.filter(sub => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(sub.created_at) >= thirtyDaysAgo;
  }).length;

  const handleCopyEndpoint = () => {
    const endpoint = getFormSubmissionUrl(formId);
    navigator.clipboard.writeText(endpoint);
    alert("Form endpoint copied to clipboard!");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading form details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!form) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Form not found</h1>
            <Link href="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                <Link href="/submissions" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                  Submissions
                </Link>
                <Link href="/account" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                  Account
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {form.form_id}
            </h1>
            
            {/* Tabs */}
            <div className="flex space-x-8 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "submissions"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Submissions
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "settings"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Submissions Summary */}
              <div className="card p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {monthlySubmissions}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Submissions (Last 30 Days)
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Submissions Chart */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SUBMISSIONS</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">inbox</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">spam</span>
                    </div>
                    <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded flex items-end justify-center">
                      <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        No data available
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">LAST 30 DAYS</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Timezone: UTC</p>
                  </div>
                </div>

                {/* Submissions by Country */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SUBMISSIONS BY COUNTRY</h3>
                  <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                    <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                      No data available
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">LAST 30 DAYS</p>
                </div>

                {/* Submissions Status */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SUBMISSIONS STATUS</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">success</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">error</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">pending</span>
                    </div>
                    <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                      <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        No data available
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">LAST 15 DAYS</p>
                  </div>
                </div>
              </div>

              {/* Integration Section */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">INTEGRATION</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Form endpoint
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={getFormSubmissionUrl(formId)}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={handleCopyEndpoint}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/form/${formId}/settings`}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="card p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Submissions</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  View detailed submissions for this form
                </p>
                <Link href="/submissions" className="btn-primary">
                  View All Submissions
                </Link>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="card p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Form Settings</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Configure form settings and preferences
                </p>
                <Link href={`/form/${formId}/settings`} className="btn-primary">
                  Configure Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
