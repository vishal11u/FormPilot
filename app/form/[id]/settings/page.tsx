"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import Link from "next/link";

export default function FormSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const [notifyEmail, setNotifyEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("forms")
        .select("notify_email, redirect_url")
        .eq("form_id", formId)
        .single();
      if (data) {
        setNotifyEmail(data.notify_email || "");
        setRedirectUrl(data.redirect_url || "");
      }
    };
    load();
  }, [formId]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from("forms")
      .update({ notify_email: notifyEmail, redirect_url: redirectUrl || null })
      .eq("form_id", formId);
    setSaving(false);
    router.push(`/form/${formId}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href={`/form/${formId}`}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Form Settings
            </h1>
          </div>
          <form onSubmit={onSave} className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notification Email
              </label>
              <input
                className="input-field"
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Redirect URL (optional)
              </label>
              <input
                className="input-field"
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://yoursite.com/thank-you"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <Link href={`/form/${formId}`} className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
