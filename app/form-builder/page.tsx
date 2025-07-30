"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function generateFormId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function FormBuilderPage() {
  const router = useRouter();
  const [notifyEmail, setNotifyEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    const form_id = generateFormId();
    const { error: insertError } = await supabase.from("forms").insert([
      {
        form_id,
        user_id: user.id,
        notify_email: notifyEmail,
        redirect_url: redirectUrl || null,
      },
    ]);
    setLoading(false);
    if (insertError) setError(insertError.message);
    else router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
      <h2>Create New Form</h2>
      <form onSubmit={handleCreate}>
        <input
          type="email"
          placeholder="Notify Email"
          value={notifyEmail}
          onChange={(e) => setNotifyEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="url"
          placeholder="Redirect URL (optional)"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating..." : "Create Form"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
