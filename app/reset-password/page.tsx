"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // When Supabase magic link opens this page, user is already authenticated temporarily
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(error ? "error" : "success");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full card p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Reset Password</h1>
        {status === "success" ? (
          <p className="text-green-600 dark:text-green-400">Password updated. You can close this tab.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="password"
              className="input-field"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit" className="btn-primary w-full">Update Password</button>
            {status === "error" && (
              <p className="text-red-600 dark:text-red-400 text-sm">Failed to update password.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}


