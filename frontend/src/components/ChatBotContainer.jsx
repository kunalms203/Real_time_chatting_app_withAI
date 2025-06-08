import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios"; // ⬅️ import your axios instance

const ChatBotContainer = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?", _id: "init" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const { authUser } = useAuthStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user",
      text: inputMessage,
      _id: Date.now().toString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // ⬇️ Use axiosInstance instead of fetch
      const response = await axiosInstance.post(`/messages/chat/${authUser._id}`, {
        message: inputMessage,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.reply,
        _id: Date.now().toString() + "_bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong.",
        _id: Date.now().toString() + "_error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 overflow-y-auto max-h-[600px] border rounded shadow-md">
      <div className="text-center text-lg font-semibold text-base-content">
        🤖 Hi! I'm your chatbot. Ask me anything!
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-300 rounded mt-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full border">
                <img
                  src={
                    msg.sender === "user"
                      ? "/avatar.png"
                      : "https://s39613.pcdn.co/wp-content/uploads/2023/01/mini-robot-work.jpg_s1024x1024wisk20cF8-TlXM20IIe1r6x06amK-2t8FbyDapuipEsf3l_jGs.jpg"
                  }
                  alt={`${msg.sender} avatar`}
                />
              </div>
            </div>
            <div className="chat-bubble prose max-w-full">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full border">
                <img
                  src="https://s39613.pcdn.co/wp-content/uploads/2023/01/mini-robot-work.jpg_s1024x1024wisk20cF8-TlXM20IIe1r6x06amK-2t8FbyDapuipEsf3l_jGs.jpg"
                  alt="bot avatar"
                />
              </div>
            </div>
            <div className="chat-bubble italic text-gray-500">...</div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 input input-bordered"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          className="btn btn-primary ml-2"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBotContainer;
