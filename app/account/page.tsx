"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiTrash2,
  FiEdit2,
  FiAlertCircle,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiInbox,
  FiFileText,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    monthlySubmissions: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const { count: formsCount } = await supabase
        .from("forms")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: submissionsCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true });

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
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

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/submissions"
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  <span>Submissions</span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-indigo-600 font-semibold transition-colors"
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
                    className="flex items-center space-x-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg transition-colors font-semibold"
                  >
                    <FiUser className="text-xl" />
                    <span>Account</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Account Settings </h1>
                <p className="text-slate-600 text-lg">
                  Manage your account information and security
                </p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 bg-white text-slate-700 border-2 border-slate-200 px-5 py-3 rounded-xl font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <FiFileText className="text-lg" />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiFileText className="text-indigo-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalForms}</h3>
                <p className="text-slate-600 font-medium">Total Forms</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FiInbox className="text-emerald-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalSubmissions}</h3>
                <p className="text-slate-600 font-medium">Total Submissions</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiCalendar className="text-purple-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                  {stats.monthlySubmissions}
                </h3>
                <p className="text-slate-600 font-medium">This Month</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Details Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FiUser className="text-indigo-600 text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Account Information</h2>
              </div>

              <div className="space-y-1">
                {/* Email */}
                <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-slate-400 text-lg" />
                    <div>
                      <p className="font-semibold text-slate-900">Email Address</p>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                  <span className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg font-semibold">
                    <FiCheckCircle />
                    <span>VERIFIED</span>
                  </span>
                </div>

                {/* Password */}
                <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <FiLock className="text-slate-400 text-lg" />
                    <div>
                      <p className="font-semibold text-slate-900">Password</p>
                      <p className="text-sm text-slate-600">••••••••••</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                    <span>Reset Password</span>
                  </button>
                </div>

                {/* Registration Date */}
                <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="text-slate-400 text-lg" />
                    <div>
                      <p className="font-semibold text-slate-900">Member Since</p>
                      <p className="text-sm text-slate-600">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiBarChart2 className="text-purple-600 text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Usage Statistics</h2>
              </div>

              <div className="space-y-6">
                {/* Monthly Submissions */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <FiTrendingUp className="text-indigo-600" />
                      <p className="font-semibold text-slate-900">Monthly Submissions</p>
                    </div>
                    <p className="text-slate-600 font-medium">{stats.monthlySubmissions} / 150</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((stats.monthlySubmissions / 150) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-slate-600">
                      {Math.round((stats.monthlySubmissions / 150) * 100)}% of monthly quota used
                    </p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                    <FiCheckCircle className="text-emerald-500 text-xl mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Unlimited Forms</p>
                      <p className="text-sm text-slate-600">Create as many forms as you need</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                    <FiCheckCircle className="text-emerald-500 text-xl mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-600">Instant submission alerts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiShield className="text-red-600 text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Security & Privacy</h2>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <FiAlertCircle className="text-red-600 text-2xl mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-2 text-lg">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. This will permanently
                        delete all your forms, submissions, and data. Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        <FiTrash2 />
                        <span>{loading ? "Deleting..." : "Delete My Account"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
