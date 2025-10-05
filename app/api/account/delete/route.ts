import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // Delete user's data (forms and related submissions)
    // Delete submissions for all of the user's forms
    const { data: userForms } = await supabaseAdmin
      .from("forms")
      .select("form_id")
      .eq("user_id", userId);

    const formIds = (userForms || []).map((f: any) => f.form_id);
    if (formIds.length > 0) {
      await supabaseAdmin.from("submissions").delete().in("form_id", formIds);
    }
    await supabaseAdmin.from("forms").delete().eq("user_id", userId);

    // Delete user account via admin API
    await supabaseAdmin.auth.admin.deleteUser(userId);

    // Audit log
    try {
      await supabaseAdmin.from("admin_audit").insert([{ event: "account_deleted", user_id: userId, meta: {} }]);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}


