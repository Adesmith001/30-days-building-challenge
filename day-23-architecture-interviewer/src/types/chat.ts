import type { InterviewState } from "@/types/interview";

export type MessageRole =
  | "user"
  | "assistant"
  | "system_internal";

export interface MessageMetadata {
  kind?: "interview" | "review" | "diagram";
  stopped?: boolean;
  regenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  sequence_number: number;
  client_request_id?: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  interview_stage: string;
  interview_state: InterviewState;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface Profile {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}
