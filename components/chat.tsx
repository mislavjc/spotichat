'use client';

import { useChat } from 'ai/react';

export const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="mx-auto flex h-screen w-full max-w-lg flex-col p-24">
      <section className="mb-auto">
        {messages.map((m) => (
          <div className="mb-4" key={m.id}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </section>
      <form className="flex space-x-4" onSubmit={handleSubmit}>
        <input
          className="rounded-md p-2 text-black"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button
          className="rounded-md border-2 border-solid border-white p-2"
          type="submit"
        >
          Send
        </button>
      </form>
    </main>
  );
};
