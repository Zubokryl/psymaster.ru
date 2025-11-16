import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const formatted = data.map(r => ({
    ...r,
    date: new Date().toISOString().split("T")[0],
  }));

  return new Response(JSON.stringify(formatted), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  const { name, text, avatar } = body;

  if (!name || !text) {
    return new Response(JSON.stringify({ error: "Имя и текст обязательны" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert([{ name, text, avatar: avatar || null }])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ ...data, date: new Date().toISOString().split("T")[0] }),
    { status: 200 }
  );
}


export async function DELETE(req) {
  const { id } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Нет доступа" }), { status: 401 });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Не указан ID отзыва" }), { status: 400 });
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

