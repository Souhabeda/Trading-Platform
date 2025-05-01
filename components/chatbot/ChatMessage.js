'use client';

import ChatbotIcon from "./ChatbotIcon";

export default function ChatMessage ({ chat }) {
  return (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
      {chat.role === "model" && <ChatbotIcon />}
      <p className={`message-text ${chat.isError ? 'error' : ''}`}>{chat.text}</p>
    </div>
  );
};

