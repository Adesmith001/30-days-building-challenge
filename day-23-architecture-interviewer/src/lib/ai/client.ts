import "server-only";

import Groq from "groq-sdk";

import {
  getServerEnv,
} from "@/lib/env";

let client:
  Groq | null = null;

export function getGroq() {
  if (client) {
    return client;
  }

  const env =
    getServerEnv();

  client =
    new Groq({
      apiKey:
        env.AI_API_KEY,
    });

  return client;
}
