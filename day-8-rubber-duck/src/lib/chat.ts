import type {
  DuckResponse,
  QuestionType,
} from "../schemas/ai";

import type {
  ChatMessage,
  ThreadTurn,
} from "../schemas/session";

export function createUserMessage(
  content: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "user",
    content: content.trim(),
    createdAt: Date.now(),
  };
}

export function createAssistantMessage(
  content: string,
  questionType?: QuestionType,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    questionType,
    createdAt: Date.now(),
  };
}

export function responseMessage(
  response: DuckResponse,
): ChatMessage | null {
  const content =
    response.question ||
    response.hint?.text ||
    response.explanation ||
    response.resolution?.conclusion ||
    response.note ||
    response.tryThis;

  return content
    ? createAssistantMessage(
        content,
        response.questionType ?? undefined,
      )
    : null;
}

export function sessionMessages({
  problem,
  turns,
}: {
  problem: string;
  turns: ThreadTurn[];
}): ChatMessage[] {
  const messages: ChatMessage[] = [
    {
      id: "problem",
      role: "user",
      content: problem,
      createdAt: 0,
    },
  ];

  for (const turn of turns) {
    messages.push(
      {
        id: `${turn.id}-question`,
        role: "assistant",
        content: turn.question,
        questionType: turn.type,
        createdAt: turn.createdAt - 1,
      },
      {
        id: turn.id,
        role: "user",
        content: turn.answer,
        createdAt: turn.createdAt,
      },
    );
  }

  return messages;
}
