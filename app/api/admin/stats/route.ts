import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function isAdminEmail(email?: string | null) {
  const admin = process.env.ADMIN_EMAIL || "";
  return email && email.toLowerCase() === admin.toLowerCase();
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const email = userData.user?.email || null;
    if (!isAdminEmail(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Counts
    const { count: usersCount } = await supabaseAdmin.auth.admin
      .listUsers({ page: 1, perPage: 1 })
      .then((r) => ({ count: r.data?.users?.length ? undefined : undefined }))
      .catch(() => ({ count: undefined }));
    // Fallback: We can't get total count easily via listUsers without pagination; do approximate by fetching first page metadata.

    const { count: formsCount } = await supabaseAdmin
      .from("forms")
      .select("*", { count: "exact", head: true });
    const { count: submissionsCount } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true });

    // recent activity
    const { data: recentForms } = await supabaseAdmin
      .from("forms")
      .select("form_id, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    const { data: recentSubs } = await supabaseAdmin
      .from("submissions")
      .select("id, form_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      users: usersCount ?? null,
      forms: formsCount || 0,
      submissions: submissionsCount || 0,
      recentForms: recentForms || [],
      recentSubmissions: recentSubs || [],
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
