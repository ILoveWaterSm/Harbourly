"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendMessageAction } from "@/lib/actions/bookings";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

interface Props {
  bookingId: string;
  messages: Message[];
  currentUserId: string;
}

export default function ChatPanel({ bookingId, messages: initialMessages, currentUserId }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || isPending) return;
    const content = input.trim();
    setInput("");

    startTransition(async () => {
      const result = await sendMessageAction(bookingId, content);
      if (result.success) {
        router.refresh();
        if (result.message) {
          setMessages((prev) => [...prev, {
            id: result.message!.id,
            content: result.message!.content,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId, name: result.message!.sender.name },
          }]);
        }
      }
    });
  }

  return (
    <div className="card flex flex-col h-[500px]">
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-primary-text text-sm">Session Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-secondary-text text-xs text-center mt-8">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender.id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-[8px] px-3 py-2 ${isMe ? "bg-accent text-white" : "bg-gray-100 text-primary-text"}`}>
                  {!isMe && <p className="text-xs font-semibold mb-0.5 text-gray-600">{msg.sender.name}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-0.5 ${isMe ? "text-green-100" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border flex gap-2">
        <input
          type="text"
          className="input text-sm flex-1"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={isPending || !input.trim()}
          className="btn-primary px-3 py-2 disabled:opacity-60"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
