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

    const chatChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => setMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(chatChannel);
  }, []);

  const handleDeleteMessage = async (id) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);
      if (error) throw error;

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
      className="min-h-screen text-white bg-cover bg-center bg-no-repeat pt-10"
      style={{ backgroundImage: "url('/assets/leaveschat.jpg')" }}
    >
      <div className="mx-auto px-4 py-6 max-w-3xl">

        {/* Контейнер чата прозрачный */}
        <div
          className="rounded-lg border border-gray-800 overflow-hidden flex flex-col h-[calc(100vh-100px)]"
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
        >

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-300">
                Нет сообщений. Начните общение первым!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_admin ? "justify-start" : msg.user_email === nickname ? "justify-end" : "justify-start"}`}
                >
                  <div
  style={{
    maxWidth: "clamp(60%, 90vw, 90%)",
    padding: "clamp(0.75rem, 2vw, 1rem)",
    borderRadius: "1.25rem",
    backgroundColor: msg.is_admin
      ? "rgba(59,130,246,0.5)"
      : msg.user_email === nickname
      ? "rgba(59,130,246,1)"
      : "rgba(55,65,81,0.8)",
    color: "white",
    borderTopLeftRadius: msg.is_admin || msg.user_email !== nickname ? "0" : undefined,
    borderTopRightRadius: msg.user_email === nickname ? "0" : undefined,
    overflowWrap: "break-word",  
    wordBreak: "break-word",     
    whiteSpace: "pre-wrap",      
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "clamp(0.7rem, 2vw, 0.875rem)" }}>
    <span>{msg.is_admin ? "Админ" : msg.user_email === nickname ? "Вы" : msg.user_email}</span>
    <span style={{ opacity: 0.7 }}>
      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
    {user?.user_metadata?.role === "admin" && (
      <button
        onClick={() => handleDeleteMessage(msg.id)}
        style={{
          color: "#f87171",
          marginLeft: "0.5rem",
          fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        удалить
      </button>
    )}
  </div>
  <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
    {msg.content}
  </div>
</div>

                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
<form
  onSubmit={handleSendMessage}
  style={{
    display: "flex",
    flexWrap: "wrap", 
    gap: "clamp(0.25rem, 1vw, 0.5rem)",
    padding: "clamp(0.5rem, 1.5vw, 1rem)",
    borderTop: "1px solid rgba(75,85,99,0.8)",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "flex-end", 
  }}
>
  {/* Никнейм */}
<input
  type="text"
  value={nickname}
  onChange={(e) => setNickname(e.target.value)}
  placeholder="Ваш никнейм"
  ref={inputRef}
  style={{
    width: "clamp(6rem, 20vw, 10rem)",
    padding: "clamp(0.5rem, 1.5vw, 0.75rem)",
    borderRadius: "0.5rem",
    border: "1px solid rgba(107,114,128,0.8)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "white",
    flexShrink: 0,
    fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)", 
  }}
/>

{/* Сообщение */}
<input
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  placeholder="Написать сообщение..."
  style={{
    flex: "1 1 auto",
    minWidth: "8rem",
    padding: "clamp(0.5rem, 1.5vw, 0.75rem)",
    borderRadius: "0.5rem",
    border: "1px solid rgba(107,114,128,0.8)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)", 
  }}
/>

  {/* Кнопка */}
  <button
    type="submit"
    disabled={!newMessage.trim() || (!nickname.trim() && !(user?.user_metadata?.role === "admin"))}
    style={{
      padding: "clamp(0.45rem, 1vw, 0.65rem) clamp(0.75rem, 2vw, 1rem)", 
      border: "none",
      backgroundColor: "rgba(59,130,246,0.9)",
      color: "white",
      cursor: "pointer",
      fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
      flexShrink: 0, 
    }}
  >
    Отправить
  </button>
</form>

        </div>
      </div>
    </div>
  );
}
