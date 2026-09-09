import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "motion/react";

import type {
  ChatMessage,
} from "../schemas/session";

const thinkingStates = [
  "READING THE SITUATION",
  "LOOKING FOR THE REAL QUESTION",
  "CHECKING THE ASSUMPTION",
  "FINDING THE NEXT USEFUL STEP",
];

export function ConversationView({
  messages,
  busy,
  className = "",
}: {
  messages: ChatMessage[];
  busy: boolean;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  useEffect(() => {
    if (!busy) {
      return;
    }

    const timer = window.setInterval(() => {
      setThinkingIndex((index) =>
        (index + 1) % thinkingStates.length,
      );
    }, 1800);

    return () => window.clearInterval(timer);
  }, [busy]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, busy]);

  return (
    <section
      aria-label="Conversation"
      className={`scrollbar-hidden border-y border-rule py-7 ${className}`}
    >
      <div className="mb-6 flex items-center justify-between font-mono text-[9px] tracking-[0.16em] text-muted">
        <span>THE CONVERSATION</span>
        <span>{messages.length} MESSAGES</span>
      </div>

      <div className="space-y-5" aria-live="polite">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={`max-w-[88%] ${
                message.role === "user"
                  ? "border border-ink bg-ink px-5 py-4 text-white"
                  : "border-l-2 border-ink pl-5"
              }`}
            >
              <div className="mb-2 font-mono text-[9px] tracking-[0.15em] opacity-60">
                {message.role === "user"
                  ? "YOU"
                  : message.questionType
                    ? `DUCK · ${message.questionType.toUpperCase()}`
                    : "DUCK"}
              </div>
              <p className="font-serif text-lg leading-8 md:text-xl">
                {message.content}
              </p>
            </div>
          </motion.div>
        ))}

        {busy ? <ThinkingBubble label={thinkingStates[thinkingIndex]} /> : null}
        <div ref={endRef} />
      </div>
    </section>
  );
}

function ThinkingBubble({ label }: { label: string }) {
  return (
    <div className="flex justify-start" role="status">
      <div className="border-l-2 border-rule pl-5">
        <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-muted">
          <span>DUCK IS THINKING</span>
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                className="h-1 w-1 bg-ink"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: item * 0.16 }}
              />
            ))}
          </span>
        </div>
        <p className="font-mono text-[10px] tracking-[0.14em] text-graphite">
          {label}…
        </p>
      </div>
    </div>
  );
}
