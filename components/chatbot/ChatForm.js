'use client';

import { useRef } from "react";

export default function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {

  const inputRef = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    const newUserMessage = { role: "user", text: userMessage };

    setChatHistory((history) => [
      ...history,
      newUserMessage,
      { role: "model", text: "Thinking..." }
    ]);

    await generateBotResponse([...chatHistory, newUserMessage]);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask me anything..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded" type="submit">
        arrow_upward
      </button>
    </form>
  );
};

