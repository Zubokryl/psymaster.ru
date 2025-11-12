import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";


// Получить все статьи
export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // вернуть конкретную статью
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single(); // возвращает один объект
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    // вернуть все статьи
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

// Добавить новую статью
export async function POST(req) {
  const body = await req.json();
  const { data, error } = await supabase.from("articles").insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Обновить статью
export async function PUT(req) {
  const body = await req.json();
  const { id, ...fields } = body;
  const { data, error } = await supabase.from("articles").update(fields).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Удалить статью
export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id не указан" }, { status: 400 });

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}


