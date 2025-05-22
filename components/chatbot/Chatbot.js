'use client';

import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";


export default function Chatbot () {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef(null);

    const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError }
      ]);
    };

    const userMessage = history[history.length - 1].text.toLowerCase().trim();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok || !data.response) {
        throw new Error(data.error || "No valid response from backend.");
      }

      updateHistory(data.response);
    } catch (err) {
      console.error("Erreur côté backend:", err.message);
      updateHistory("Erreur avec le serveur. Réessaie plus tard.", true);
    }
  };

  // Scroll automatique vers le bas après chaque message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  // Chargement depuis localStorage si moins de 24h
  useEffect(() => {
    const savedData = localStorage.getItem("chatHistoryData");
    if (savedData) {
      const { history, timestamp } = JSON.parse(savedData);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - timestamp < twentyFourHours) {
        setChatHistory(history);
      } else {
        localStorage.removeItem("chatHistoryData"); // données expirées
      }
    }
  }, []);

  // Sauvegarde dans localStorage avec timestamp
  useEffect(() => {
    const dataToSave = {
      history: chatHistory,
      timestamp: Date.now()
    };
    localStorage.setItem("chatHistoryData", JSON.stringify(dataToSave));
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey There 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};
