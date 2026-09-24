import type {
  ChatMessage,
  Conversation,
} from "@/types/chat";

export function buildMarkdownExport(
  conversation: Conversation,
  messages: ChatMessage[],
) {
  const lines = [
    `# ${conversation.title}`,
    "",
    `Exported from Architecture Interviewer`,
    "",
    "---",
    "",
  ];

  for (
    const message
    of messages
  ) {
    if (
      message.role ===
      "system_internal"
    ) {
      continue;
    }

    lines.push(
      message.role === "user"
        ? "## You"
        : "## Architecture Interviewer",
    );

    lines.push("");
    lines.push(
      message.content,
    );
    lines.push("");
  }

  return lines.join("\n");
}
