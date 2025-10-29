import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const form_id = req.nextUrl.searchParams.get("form_id");
  const name = (formData.get("name") || "").toString();
  const email = (formData.get("email") || "").toString();
  const mobile = (formData.get("mobile") || "").toString();
  const remark = (formData.get("remark") || "").toString();
  const honeypot = (formData.get("_hp") || "").toString();

  // Honeypot: if filled, likely a bot
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!form_id) {
    return NextResponse.json({ error: "Missing form_id" }, { status: 400 });
  }

  // Find the form and get redirect_url
  const { data: form, error: formError } = await supabaseAdmin
    .from("forms")
    .select("redirect_url")
    .eq("form_id", form_id)
    .single();

  if (formError || !form) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[submit] form lookup failed", {
        form_id,
        supabaseUrlPresent: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        formError,
      });
    }
    return NextResponse.json({ error: "Invalid form_id" }, { status: 400 });
  }

  // Basic field validation (adjust as needed)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { error: insertError } = await supabaseAdmin
    .from("submissions")
    .insert([{ form_id, name, email, mobile, remark }]);
  if (insertError) {
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  if (form.redirect_url) {
    try {
      const url = new URL(form.redirect_url);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return NextResponse.redirect(url.toString());
      }
    } catch {}
  }

  return NextResponse.json({ success: true });
}
