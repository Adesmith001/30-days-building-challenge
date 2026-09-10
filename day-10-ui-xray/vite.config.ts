import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  defineConfig,
  loadEnv,
  type Plugin,
} from "vite";

function localApi(): Plugin {
  return {
    name: "local-analyze-api",
    configureServer(server) {
      server.middlewares.use(
        "/api/analyze-ui",
        async (req, res, next) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          try {
            const chunks: Buffer[] = [];

            for await (const chunk of req) {
              chunks.push(
                Buffer.isBuffer(chunk)
                  ? chunk
                  : Buffer.from(chunk),
              );
            }

            const body = JSON.parse(
              Buffer.concat(chunks).toString("utf8"),
            );

            const { default: handler } =
              await import("./api/analyze-ui.js");

            const response = {
              status(code: number) {
                res.statusCode = code;
                return response;
              },
              json(value: unknown) {
                res.setHeader(
                  "Content-Type",
                  "application/json",
                );
                res.end(JSON.stringify(value));
                return response;
              },
            } as unknown as VercelResponse;

            await handler(
              Object.assign(req, { body }) as VercelRequest,
              response,
            );
          } catch (error) {
            next(error);
          }
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value;
  }

  return {
    plugins: [react(), tailwindcss(), localApi()],
  };
});
