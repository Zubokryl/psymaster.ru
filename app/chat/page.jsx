// app/chat/page.jsx
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ 
          content: newMessage,
          user_id: user.id,
          user_email: user.email
        }]);

      if (error) throw error;

      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка чата...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-4 ${
              msg.user_id === user?.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            }`}>
              <div className="font-semibold">
                {msg.user_id === user?.id ? 'Вы' : msg.user_email}
              </div>
              <div className="mt-1">{msg.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}
