import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";


export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single(); 
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || {}); 
  } else {
  
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []); 
  }
}


export async function POST(req) {
  const body = await req.json();
  const { data, error } = await supabase.from("articles").insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);

}


export async function PUT(req) {
  const body = await req.json();
  const { id, ...fields } = body;
  const { data, error } = await supabase.from("articles").update(fields).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);

}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id не указан" }, { status: 400 });

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}


