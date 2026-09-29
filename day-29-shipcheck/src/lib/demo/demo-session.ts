import { analyzeRelease } from "@/lib/analysis/analyze";
import { classifyFile } from "@/lib/analysis/classify";
import type {
  ChangedFile,
  ReleaseSession,
} from "@/types/release";

function file(
  path: string,
  additions: number,
  deletions: number,
  patch = "",
): ChangedFile {
  return {
    path,
    status: "modified",
    additions,
    deletions,
    patch,
    areas: classifyFile(path),
  };
}

export function makeDemoSession(): ReleaseSession {
  const files: ChangedFile[] = [
    file(
      "src/api/checkout.ts",
      84,
      32,
      `
+const secret = process.env.PAYMENT_WEBHOOK_SECRET
+export async function createCheckout() {}
`,
    ),
    file("src/api/webhooks.ts", 46, 18),
    file("src/payments/payment-service.ts", 61, 21),
    file(
      "supabase/migrations/20260925_add_checkout_state.sql",
      16,
      2,
      `
+ALTER TABLE checkout
+ADD COLUMN state TEXT;
`,
    ),
    file("src/db/checkout.ts", 29, 8),
    file(
      ".env.example",
      2,
      0,
      `
+PAYMENT_WEBHOOK_SECRET=
`,
    ),
    file("package.json", 3, 3),
    file("pnpm-lock.yaml", 78, 50),
    file("src/components/checkout-form.tsx", 33, 11),
    file("src/components/payment-error.tsx", 18, 4),
    file("src/app/checkout/page.tsx", 17, 9),
    file("src/styles/checkout.css", 20, 8),
    file("src/lib/currency.ts", 6, 3),
    file("src/lib/idempotency.ts", 8, 1),
    file("src/api/payment-status.ts", 11, 4),
    file("src/types/checkout.ts", 9, 2),
    file("src/tests/payment.test.ts", 24, 8),
    file("src/tests/checkout.test.ts", 19, 6),
    file("src/lib/errors.ts", 5, 2),
    file("README.md", 4, 1),
    file("docs/checkout.md", 7, 2),
    file("src/constants/payments.ts", 4, 1),
    file("src/api/health.ts", 2, 1),
  ];

  const session = analyzeRelease({
    id: "demo-checkout-184",
    title: "Checkout Flow Refactor",
    repository: "acme/checkout",
    source: {
      kind: "demo",
      prNumber: 184,
      url: "https://github.com/acme/checkout/pull/184",
    },
    files,
    baseSha: "e42bd98",
    headSha: "4f12d8a",
    ci: [
      ci("build", "BUILD", "pass"),
      ci("unit", "UNIT TESTS", "pass"),
      ci("typecheck", "TYPECHECK", "pass"),
      ci("lint", "LINT", "pass"),
      ci("e2e", "E2E CHECKOUT", "fail"),
    ],
  });

  const passed = new Set([
    "dependency-evidence",
    "payment-success",
    "payment-failure",
    "api-compatibility",
  ]);

  session.gates = session.gates.map((gate) => {
    if (!passed.has(gate.id)) return gate;

    return {
      ...gate,
      status: "pass",
      evidence: [
        {
          id: `demo-${gate.id}`,
          type: "confirmation",
          text: "Verified in the demo release fixture.",
          by: "ADESMITH",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  });

  return session;
}

function ci(
  id: string,
  name: string,
  status: "pass" | "fail" | "pending",
) {
  return {
    id,
    name,
    status,
    required: true,
  };
}