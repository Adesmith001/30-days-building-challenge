import { z } from "zod";

export const chatRequestSchema =
  z.object({
    conversationId:
      z.string().uuid().nullable(),

    content:
      z.string()
        .trim()
        .min(1)
        .max(20_000)
        .optional(),

    requestId:
      z.string().uuid(),

    mode:
      z
        .enum([
          "message",
          "regenerate",
        ])
        .default("message"),

    userMessageId:
      z.string()
        .uuid()
        .optional(),
  })
  .superRefine(
    (value, context) => {
      if (
        value.mode ===
          "message" &&
        !value.content
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,

          message:
            "Message content is required.",
        });
      }

      if (
        value.mode ===
          "regenerate" &&
        !value.userMessageId
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,

          message:
            "User message is required.",
        });
      }
    },
  );

export const editMessageSchema =
  z.object({
    content:
      z.string()
        .trim()
        .min(1)
        .max(20_000),
  });

export const renameConversationSchema =
  z.object({
    title:
      z.string()
        .trim()
        .min(1)
        .max(80),
  });
