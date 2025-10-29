"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMail,
  FiExternalLink,
  FiSave,
  FiX,
  FiSettings,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

export default function FormSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const [notifyEmail, setNotifyEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      setLoading(false);
    };
    load();
  }, [formId]);

  const onSave = async () => {
    if (!notifyEmail) {
      alert("Please enter a notification email");
      return;
    }

    setSaving(true);
    try {
      await supabase
        .from("forms")
        .update({ notify_email: notifyEmail, redirect_url: redirectUrl || null })
        .eq("form_id", formId);

      setSaveSuccess(true);
      setTimeout(() => {
        router.push(`/form/${formId}`);
      }, 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading settings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/form/${formId}`}
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium mb-4"
            >
              <FiArrowLeft className="text-lg" />
              <span>Back to Form Details</span>
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiSettings className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Form Settings</h1>
                <p className="text-slate-600 text-lg mt-1">Configure your form preferences</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
              <FiCheckCircle className="text-emerald-600 text-2xl" />
              <div>
                <p className="font-semibold text-emerald-900">Settings saved successfully!</p>
                <p className="text-sm text-emerald-700">Redirecting back to form details...</p>
              </div>
            </div>
          )}

          {/* Form ID Display */}
          <div className="bg-slate-100 rounded-xl p-4 mb-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase mb-1">Form ID</p>
                <p className="text-lg font-bold text-slate-900">{formId}</p>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="space-y-6">
            {/* Notification Email Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <FiMail className="text-indigo-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Notification Email</h2>
                  <p className="text-sm text-slate-600">
                    Receive instant notifications when someone submits your form
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all font-medium"
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="mt-2 flex items-start space-x-2">
                  <FiInfo className="text-indigo-600 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    You'll receive an email notification for every form submission
                  </p>
                </div>
              </div>
            </div>

            {/* Redirect URL Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <FiExternalLink className="text-purple-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Success Redirect URL</h2>
                  <p className="text-sm text-slate-600">
                    Redirect users to a custom page after successful submission
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Redirect URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FiExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all font-medium"
                    type="url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://yoursite.com/thank-you"
                  />
                </div>
                <div className="mt-2 flex items-start space-x-2">
                  <FiInfo className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Leave empty to show a default success message
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Important</p>
                  <p className="text-sm text-amber-800">
                    Changes will be applied immediately. Make sure to test your form after updating
                    settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={onSave}
                disabled={saving || saveSuccess}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <FiCheckCircle className="text-xl" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-xl" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
              <Link
                href={`/form/${formId}`}
                className="flex items-center justify-center space-x-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <FiX className="text-xl" />
                <span>Cancel</span>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  Use a dedicated email address for form notifications to keep them organized
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  Create a custom thank you page to engage with your users after submission
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Test your redirect URL to ensure it works correctly before going live</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
