'use client';

import { Message } from '@prisma/client';
import { useChat } from 'ai/react';
import { CornerDownLeft } from 'lucide-react';
import { Session } from 'next-auth';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { useAutoScroll } from 'hooks/use-auto-scroll';
import { useEnterSubmit } from 'hooks/use-enter-submit';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MemoizedReactMarkdown } from './markdown';

interface Props {
  initialMessages: Message[];
  user: Session | null;
}

export const Chat = ({ initialMessages, user }: Props) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages,
    body: {
      userId: user?.id,
    },
  });

  const { formRef, onKeyDown } = useEnterSubmit();
  const messagesEndRef = useAutoScroll([messages]);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-screen-md flex-col p-8">
      <div>
        <div className="mb-20 flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`${
                  m.role === 'user' ? 'bg-green-500 text-white' : 'bg-gray-100'
                } max-w-full overflow-hidden rounded-md px-4 py-2`}
              >
                <MemoizedReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  components={{
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>;
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline"
                        >
                          {children}
                        </a>
                      );
                    },
                    img({ src, alt }) {
                      if (src) {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt={alt === undefined ? '' : alt}
                            className="my-2 aspect-square max-h-64 w-full rounded-sm object-cover"
                          />
                        );
                      }
                    },
                  }}
                >
                  {m.content}
                </MemoizedReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-screen-md"
          ref={formRef}
        >
          <div className="relative rounded-t-lg border bg-white p-4">
            <Textarea
              value={input}
              onChange={handleInputChange}
              className="min-h-[50px] w-full resize-none bg-transparent px-4 py-[1rem] pr-20 focus-within:outline-none sm:text-sm"
              placeholder="Type your question here..."
              onKeyDown={onKeyDown}
            />
            <Button
              type="submit"
              className="absolute right-4 top-6 mr-4 mt-2"
              disabled={!input}
            >
              <CornerDownLeft />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
