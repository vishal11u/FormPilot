"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    monthlySubmissions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch forms count
      const { count: formsCount } = await supabase
        .from("forms")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch submissions count
      const { count: submissionsCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true });

      // Fetch monthly submissions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: monthlyCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      setStats({
        totalForms: formsCount || 0,
        totalSubmissions: submissionsCount || 0,
        monthlySubmissions: monthlyCount || 0,
      });
    };

    fetchStats();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      // Delete user data
      await supabase.from("submissions").delete().eq("form_id", "temp");
      await supabase.from("forms").delete().eq("user_id", user?.id);

      // Delete user account
      await supabase.auth.admin.deleteUser(user?.id || "");

      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset:", error);
      alert("Failed to send password reset email. Please try again.");
    }
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
                <Link
                  href="/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/submissions"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Submissions
                </Link>
                <Link href="/account" className="text-red-600 dark:text-red-400 font-medium">
                  Account
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your account and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <nav className="space-y-2">
                  <Link
                    href="#account"
                    className="flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Account</span>
                  </Link>
                  <Link
                    href="#team"
                    className="flex items-center space-x-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span>Team</span>
                  </Link>
                  <Link
                    href="#billing"
                    className="flex items-center space-x-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>Billing</span>
                  </Link>
                  <Link
                    href="#domains"
                    className="flex items-center space-x-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                      />
                    </svg>
                    <span>Domains</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Section */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  ACCOUNT
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Full Name</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user?.user_metadata?.full_name || "Not set"}
                      </p>
                    </div>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                      Edit
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Account Email</p>
                      <p className="text-slate-600 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                      Edit
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Password</p>
                      <p className="text-slate-600 dark:text-slate-400">••••••••••</p>
                    </div>
                    <button
                      onClick={handlePasswordReset}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Two Factor Authentication
                      </p>
                      <span className="inline-block px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                        Disabled
                      </span>
                    </div>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                      Enable
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Registered on</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user?.created_at ? new Date(user.created_at).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium disabled:opacity-50"
                    >
                      {loading ? "Deleting..." : "Delete account"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Usage Section */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">USAGE</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-slate-900 dark:text-white">
                        Monthly Submissions
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {stats.monthlySubmissions} / 50
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((stats.monthlySubmissions / 50) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {Math.round((stats.monthlySubmissions / 50) * 100)}% of monthly submissions
                      quota used
                    </p>
                  </div>
                </div>
              </div>

              {/* Linked Emails Section */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    LINKED EMAILS
                  </h2>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    + Add Email
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
                    </div>
                    <span className="inline-block px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    1 of 2 email addresses added.{" "}
                    <span className="text-red-600 dark:text-red-400 font-medium">Upgrade</span> to
                    add unlimited addresses.
                  </p>
                </div>
              </div>

              {/* Upgrade Section */}
              <div className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                      Upgrade your account for:
                    </h2>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">1.</span>
                        <span>File upload</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">2.</span>
                        <span>More submissions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">3.</span>
                        <span>Custom "thank you" redirect</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">4.</span>
                        <span>Plugins like Google Sheets, Mailchimp and Stripe</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">5.</span>
                        <span>Improved spam filtering</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-slate-400">6.</span>
                        <span>API access</span>
                      </li>
                      <li className="text-slate-600 dark:text-slate-400">... and more!</li>
                    </ul>
                  </div>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors ml-6">
                    See Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
