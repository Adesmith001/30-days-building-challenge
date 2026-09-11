/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import {
  defineConfig,
  loadEnv,
} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import untangleHandler from "./api/untangle.js";
import transcribeHandler from "./api/transcribe.js";

type LocalRequest = IncomingMessage & {
  body?: unknown;
};

type LocalResponse = ServerResponse & {
  status: (code: number) => LocalResponse;
  json: (value: unknown) => void;
};

async function parseJsonBody(
  request: IncomingMessage,
) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString());
}

function localApi() {
  return {
    name: "local-api",
    configureServer(server: {
      middlewares: {
        use: (
          path: string,
          handler: (
            request: LocalRequest,
            response: LocalResponse,
          ) => void,
        ) => void;
      };
    }) {
      for (const [path, handler] of [
        ["/api/untangle", untangleHandler],
        ["/api/transcribe", transcribeHandler],
      ] as const) server.middlewares.use(
        path,
        async (
          request: LocalRequest,
          response: LocalResponse,
          _next?: () => void,
        ) => {
          if (request.method === "POST" && path === "/api/untangle") {
            try {
              request.body = await parseJsonBody(request);
            } catch {
              request.body = undefined;
            }
          }

          const localResponse = response as LocalResponse;

          localResponse.status = (code) => {
            localResponse.statusCode = code;
            return localResponse;
          };

          localResponse.json = (value) => {
            if (!localResponse.headersSent) {
              localResponse.setHeader(
                "Content-Type",
                "application/json",
              );
            }

            localResponse.end(JSON.stringify(value));
          };

          await handler(
            request as never,
            localResponse as never,
          );
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(
    process.env,
    loadEnv(mode, process.cwd(), ""),
  );

  return {
    plugins: [localApi(), react(), tailwindcss()],
  };
});
