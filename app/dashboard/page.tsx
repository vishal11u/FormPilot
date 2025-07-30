"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface Form {
  id: string;
  form_id: string;
  notify_email: string;
  redirect_url: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserAndForms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      const { data, error } = await supabase
        .from("forms")
        .select("id, form_id, notify_email, redirect_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setForms(data);
      setLoading(false);
    };
    getUserAndForms();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 32 }}>
      <h2>Your Forms</h2>
      <button onClick={() => router.push("/form-builder")} style={{ marginBottom: 24 }}>
        + Create New Form
      </button>
      {forms.length === 0 ? (
        <p>No forms yet.</p>
      ) : (
        <ul>
          {forms.map((form) => (
            <li key={form.id} style={{ marginBottom: 32, border: "1px solid #eee", padding: 16 }}>
              <div>
                <b>Form ID:</b> {form.form_id}
              </div>
              <div>
                <b>Notify Email:</b> {form.notify_email}
              </div>
              <div>
                <b>Redirect URL:</b> {form.redirect_url || "-"}
              </div>
              <div>
                <b>Created:</b> {new Date(form.created_at).toLocaleString()}
              </div>
              <div style={{ marginTop: 8 }}>
                <b>Embed Code:</b>
                <pre style={{ background: "#f4f4f4", padding: 8, overflowX: "auto" }}>
                  {`<form action="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/submit?form_id=${form.form_id}" method="POST">
  <input name="name" />
  <input name="email" />
  <input name="mobile" />
  <textarea name="remark"></textarea>
  <button type="submit">Submit</button>
</form>`}
                </pre>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
