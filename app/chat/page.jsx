"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState(""); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
  const loadChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(messages || []);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  loadChat();

  // --- Realtime через channel() ---
  const chatChannel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => setMessages(prev => [...prev, payload.new])
    )
    .subscribe();

  // очистка канала при размонтировании
  return () => {
    supabase.removeChannel(chatChannel);
  };
}, []);

const handleDeleteMessage = async (id) => {
  try {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Удаляем из UI
    setMessages(prev => prev.filter(m => m.id !== id));
  } catch (err) {
    console.error("Error deleting:", err.message);
  }
};



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = user?.user_metadata?.role === "admin";

      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage,
          user_id: isAdmin ? user.id : null,
          user_email: isAdmin ? user.email : nickname || "Гость",
          is_admin: isAdmin,
        },
      ]);

      if (error) throw error;

      setNewMessage("");
      if (!isAdmin) setNickname("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-white">Загрузка чата...</div>
      </div>
    );
  }

  return (
    <div
  className="min-h-screen text-white bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/assets/scratches-stains.jpg')" }}
>

      <div className="mx-auto px-4 py-6 max-w-3xl">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">Чат поддержки</h1>

        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Нет сообщений. Начните общение первым!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.is_admin
                      ? "justify-start"
                      : msg.user_email === nickname
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] rounded-2xl p-4 ${
                      msg.is_admin
                        ? "bg-blue-600/50 text-white rounded-tl-none"
                        : msg.user_email === nickname
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-800 text-white rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {msg.is_admin
                          ? "Админ"
                          : msg.user_email === nickname
                          ? "Вы"
                          : msg.user_email}
                      </span>
                      <span className="text-xs opacity-70 ml-2">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {user?.user_metadata?.role === "admin" && (
  <button
    onClick={() => handleDeleteMessage(msg.id)}
    className="text-red-400 hover:text-red-600 text-xs ml-3"
  >
    удалить
  </button>
)}

                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-800 bg-[#1a1a1a] flex items-center space-x-2"
          >
            {/* Никнейм слева */}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ваш никнейм"
              className="w-40 p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none text-white placeholder-gray-500"
            />
            {/* Сообщение */}
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Написать сообщение..."
              className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              disabled={
  !newMessage.trim() ||
  (!nickname.trim() && !(user?.user_metadata?.role === "admin"))
}

            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
