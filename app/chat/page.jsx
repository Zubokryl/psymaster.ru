"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
          router.push("/login?redirectedFrom=chat");
          return;
        }

        // Load messages
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(messages || []);

      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading chat...</div>;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await supabase.from("messages").insert([
      {
        content: newMessage,
        user_id: user.id,
        user_email: user.email,
        is_admin: user.user_metadata?.role === "admin",
      },
    ]);

    setNewMessage("");
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Чат поддержки</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[60vh] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">Нет сообщений. Будьте первым, кто напишет!</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user_id === user.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.user_id === user.id
                      ? "bg-blue-500 text-white"
                      : message.is_admin
                      ? "bg-green-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="font-medium text-xs mb-1">
                    {message.user_email} {message.is_admin && "(Админ)"}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!newMessage.trim()}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
