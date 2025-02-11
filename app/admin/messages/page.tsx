"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*");
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-6 w-full">
      <div className="mt-4 w-full">
        <h2 className="text-xl font-bold">Messages</h2>
        <div className="grid grid-cols-1 gap-6 mt-4">
          {messages.map((message) => (
            <div key={message.id} className="p-4 bg-white shadow rounded">
              <h3 className="text-lg font-bold">{message.name}</h3>
              <p className="text-gray-600">{message.email}</p>
              <p className="text-gray-800 mt-2">{message.message}</p>
              <p className="text-gray-500 text-sm mt-2">{new Date(message.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
