"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../lib/supabaseClient";

interface StatsResponse {
  users: number | null;
  forms: number;
  submissions: number;
  recentForms: { form_id: string; user_id: string; created_at: string }[];
  recentSubmissions: { id: string; form_id: string; created_at: string }[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Unauthorized or failed to load stats. Make sure ADMIN_EMAIL is set to your email.");
        return;
      }
      const json = (await res.json()) as StatsResponse;
      setStats(json);
    };
    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>
          {error && <div className="card p-4 text-red-600 dark:text-red-400">{error}</div>}
          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Users</p>
                  <p className="text-3xl font-bold">{stats.users ?? "—"}</p>
                </div>
                <div className="card p-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Forms</p>
                  <p className="text-3xl font-bold">{stats.forms}</p>
                </div>
                <div className="card p-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Submissions</p>
                  <p className="text-3xl font-bold">{stats.submissions}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Forms</h2>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {stats.recentForms.map((f) => (
                      <li key={f.form_id + f.created_at} className="flex justify-between">
                        <span>{f.form_id}</span>
                        <span className="text-slate-400">{new Date(f.created_at).toLocaleString()}</span>
                      </li>
                    ))}
                    {stats.recentForms.length === 0 && <li>No recent forms</li>}
                  </ul>
                </div>
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {stats.recentSubmissions.map((s) => (
                      <li key={s.id} className="flex justify-between">
                        <span>{s.form_id}</span>
                        <span className="text-slate-400">{new Date(s.created_at).toLocaleString()}</span>
                      </li>
                    ))}
                    {stats.recentSubmissions.length === 0 && <li>No recent submissions</li>}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}


