import { useState, useRef, useEffect } from "react";
import { Bot, ArrowLeft } from "lucide-react";
import Header from "../components/header";
import ChatMessage from "../components/chat/chat-message";
import ChatInput from "../components/chat/chat-input";

// Message type definition
const initialBotMessage = {
  type: "bot",
  content:
    "Hi! I'm AURA, your emotion-aware movie companion. I can understand how you're feeling and recommend the perfect movies for your mood. How are you feeling today?",
};

export default function ChatPage({ navigate, user, logoutMutation, toast }) {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([initialBotMessage]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { type: "user", content: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      // Simulate backend response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { type: "bot", content: data.response }]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      toast?.({
        title: "Error",
        description: "Failed to get a response from AURA. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 pt-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-teal-900/60 to-emerald-900/70"></div>
          <div
            className="w-full h-full object-cover opacity-50"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-900/50 to-emerald-900/50 backdrop-blur-sm flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-8 h-8 text-teal-400 animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white/20"></div>
                </div>
                <div>
                  <span className="text-white font-semibold text-lg">AURA</span>
                  <p className="text-white/60 text-xs">Your Emotional Movie Guide</p>
                </div>
              </div>
              <button
                onClick={() => navigate("home")}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="max-w-[80%] p-4 rounded-2xl shadow-lg bg-white/10 backdrop-blur-sm text-white rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
