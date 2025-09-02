import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const form_id = req.nextUrl.searchParams.get("form_id");
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const remark = formData.get("remark") as string;

  if (!form_id) {
    return NextResponse.json({ error: "Missing form_id" }, { status: 400 });
  }

  // Find the form and get redirect_url
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("redirect_url")
    .eq("form_id", form_id)
    .single();

  if (formError || !form) {
    return NextResponse.json({ error: "Invalid form_id" }, { status: 400 });
  }

  // Save submission to local database
  await supabase.from("submissions").insert([{ form_id, name, email, mobile, remark }]);

  // Redirect if redirect_url is set
  if (form.redirect_url) {
    return NextResponse.redirect(form.redirect_url);
  }

  return NextResponse.json({ success: true });
}
